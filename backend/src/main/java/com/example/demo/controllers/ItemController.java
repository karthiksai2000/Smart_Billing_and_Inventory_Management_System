package com.example.demo.controllers;

import com.example.demo.entities.Item;
import com.example.demo.services.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:5173") // <--- ADD THIS LINE (Matches your React Port)
public class ItemController {
    
    @Autowired
    private ItemService itemService;
    
    @GetMapping
    public List<Item> getAllItems() {
        return itemService.getAllItems();
    }

    // Convenience: fetch by customId
    @GetMapping("/by-custom/{customId}")
    public ResponseEntity<Item> getByCustomId(@PathVariable String customId) {
        return itemService.getAllItems().stream()
                .filter(i -> customId != null && customId.equalsIgnoreCase(i.getCustomId()))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Optional<Item> item = itemService.getItemById(id);
        return item.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    // 1. CREATE (Use POST)
    @PostMapping
    public Item createItem(@RequestBody Item item) {
        return itemService.createItem(item);
    }
    
    // 2. UPDATE (Use PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @RequestBody Item itemDetails) {
        try {
            Item updatedItem = itemService.updateItem(id, itemDetails);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/category/{categoryId}")
    public List<Item> getItemsByCategory(@PathVariable Long categoryId) {
        return itemService.getItemsByCategory(categoryId);
    }
    
    @GetMapping("/search")
    public List<Item> searchItems(@RequestParam String name) {
        return itemService.searchItems(name);
    }
    
    @GetMapping("/low-stock")
    public List<Item> getLowStockItems() {
        return itemService.getLowStockItems();
    }
    
    // 3. STOCK UPDATE (Use PATCH)
    // Note: Pass quantity in the URL, e.g., /api/items/1/stock?quantity=5
    @PatchMapping("/{id}/stock")
    public ResponseEntity<Item> updateStock(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            Item updatedItem = itemService.updateStock(id, quantity);
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}