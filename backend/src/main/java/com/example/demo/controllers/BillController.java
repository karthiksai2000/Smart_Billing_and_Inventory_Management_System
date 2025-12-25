package com.example.demo.controllers;

import com.example.demo.entities.Bill;
import com.example.demo.services.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillController {
    
    @Autowired
    private BillService billService;
    
    @GetMapping
    public List<Bill> getAllBills(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        if (startDate != null && endDate != null) {
            return billService.getBillsByDateRange(startDate, endDate);
        }
        return billService.getAllBills();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        Optional<Bill> bill = billService.getBillById(id);
        return bill.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        try {
            Bill createdBill = billService.createBill(bill);
            return ResponseEntity.ok(createdBill);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/cashier/{cashierId}")
    public List<Bill> getBillsByCashier(@PathVariable Long cashierId) {
        return billService.getBillsByCashier(cashierId);
    }
    
    @GetMapping("/date-range")
    public List<Bill> getBillsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate) {
        return billService.getBillsByDateRange(startDate, endDate);
    }
    
    @PostMapping("/from-cart")
    public ResponseEntity<Bill> createBillFromCart(@RequestBody CartRequest cartRequest) {
        try {
            Bill createdBill = billService.createBillFromCart(cartRequest);
            return ResponseEntity.ok(createdBill);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{id}/refund")
    public ResponseEntity<Bill> refundBill(@PathVariable Long id) {
        try {
            Bill refundedBill = billService.refundBill(id);
            return ResponseEntity.ok(refundedBill);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{billId}/refund-items")
    public ResponseEntity<Bill> refundBillItems(
            @PathVariable Long billId, 
            @RequestBody RefundItemsRequest request) {
        try {
            Bill refundedBill = billService.refundBillItems(billId, request.getItemIds());
            return ResponseEntity.ok(refundedBill);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Request class for partial refunds
    public static class RefundItemsRequest {
        private java.util.List<Long> itemIds;
        
        public java.util.List<Long> getItemIds() { return itemIds; }
        public void setItemIds(java.util.List<Long> itemIds) { this.itemIds = itemIds; }
    }
    
    // Inner class for cart request
    public static class CartRequest {
        private Long cashierId;
        private List<CartItem> items;
        private CustomerData customer;
        
        public Long getCashierId() { return cashierId; }
        public void setCashierId(Long cashierId) { this.cashierId = cashierId; }
        
        public List<CartItem> getItems() { return items; }
        public void setItems(List<CartItem> items) { this.items = items; }
        
        public CustomerData getCustomer() { return customer; }
        public void setCustomer(CustomerData customer) { this.customer = customer; }
    }
    
    public static class CartItem {
        private Long id;
        private String name;
        private Integer quantity;
        private Double price;
        
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        
        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }
    }
    
    public static class CustomerData {
        private String name;
        private String phone;
        private String email;
        private String address;
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }
}