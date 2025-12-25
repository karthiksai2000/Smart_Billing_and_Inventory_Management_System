package com.example.demo.services;

import com.example.demo.controllers.BillController;
import com.example.demo.entities.Bill;
import com.example.demo.entities.BillItem;
import com.example.demo.entities.Item;
import com.example.demo.entities.User;
import com.example.demo.repositories.BillRepository;
import com.example.demo.repositories.ItemRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {
    
    @Autowired
    private BillRepository billRepository;
    
    @Autowired
    private ItemRepository itemRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }
    
    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }
    
    @Transactional
    public Bill createBill(Bill bill) {
        bill.setDate(new Date());
        
        // Update stock quantities for each item in the bill
        for (BillItem billItem : bill.getBillItems()) {
            Item item = itemRepository.findById(billItem.getItem().getId())
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + billItem.getItem().getId()));
            
            if (item.getStockQuantity() < billItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for item: " + item.getName());
            }
            
            // Update stock
            item.setStockQuantity(item.getStockQuantity() - billItem.getQuantity());
            itemRepository.save(item);
            
            // Set the price from the item (in case it was not set)
            billItem.setPrice(item.getPrice());
            billItem.setBill(bill);
        }
        
        return billRepository.save(bill);
    }
    
    public List<Bill> getBillsByCashier(Long cashierId) {
        return billRepository.findByCashierId(cashierId);
    }
    
    public List<Bill> getBillsByDateRange(Date startDate, Date endDate) {
        return billRepository.findByDateBetween(startDate, endDate);
    }
    
    @Transactional
    public Bill createBillFromCart(BillController.CartRequest cartRequest) {
        // Find cashier user
        User cashier = userRepository.findById(cartRequest.getCashierId())
            .orElseThrow(() -> new RuntimeException("Cashier not found with id: " + cartRequest.getCashierId()));
        
        // Create new bill
        Bill bill = new Bill();
        bill.setDate(new Date());
        bill.setCashier(cashier);
        
        // Create bill items
        List<BillItem> billItems = new ArrayList<>();
        for (BillController.CartItem cartItem : cartRequest.getItems()) {
            Item item = itemRepository.findById(cartItem.getId())
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + cartItem.getId()));
            
            // Check stock availability
            if (item.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Insufficient stock for item: " + item.getName());
            }
            
            // Update stock
            item.setStockQuantity(item.getStockQuantity() - cartItem.getQuantity());
            itemRepository.save(item);
            
            // Create bill item
            BillItem billItem = new BillItem();
            billItem.setItem(item);
            billItem.setQuantity(cartItem.getQuantity());
            billItem.setPrice(cartItem.getPrice());
            billItem.setBill(bill);
            billItems.add(billItem);
        }
        
        bill.setBillItems(billItems);
        
        // Save and return the bill
        return billRepository.save(bill);
    }
    
    @Transactional
    public Bill refundBill(Long id) {
        Bill bill = billRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
        
        if (bill.getRefunded()) {
            throw new RuntimeException("Bill already fully refunded");
        }
        
        // Mark all items as refunded
        for (BillItem billItem : bill.getBillItems()) {
            if (!billItem.getRefunded()) {
                billItem.setRefunded(true);
                // Restore stock
                Item item = billItem.getItem();
                item.setStockQuantity(item.getStockQuantity() + billItem.getQuantity());
                itemRepository.save(item);
            }
        }
        
        // Mark bill as refunded
        bill.setRefunded(true);
        bill.setRefundedDate(new Date());
        
        return billRepository.save(bill);
    }
    
    @Transactional
    public Bill refundBillItems(Long billId, List<Long> itemIds) {
        Bill bill = billRepository.findById(billId)
            .orElseThrow(() -> new RuntimeException("Bill not found with id: " + billId));
        
        if (itemIds == null || itemIds.isEmpty()) {
            throw new RuntimeException("No items specified for refund");
        }
        
        // Refund specified items
        for (Long itemId : itemIds) {
            BillItem billItem = bill.getBillItems().stream()
                .filter(bi -> bi.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Bill item not found with id: " + itemId));
            
            if (billItem.getRefunded()) {
                throw new RuntimeException("Item already refunded: " + billItem.getItem().getName());
            }
            
            // Mark item as refunded
            billItem.setRefunded(true);
            
            // Restore stock
            Item item = billItem.getItem();
            item.setStockQuantity(item.getStockQuantity() + billItem.getQuantity());
            itemRepository.save(item);
        }
        
        // Check if all items are now refunded
        boolean allRefunded = bill.getBillItems().stream()
            .allMatch(bi -> bi.getRefunded());
        
        if (allRefunded) {
            bill.setRefunded(true);
            bill.setRefundedDate(new Date());
        }
        
        return billRepository.save(bill);
    }
}