package com.example.demo.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType; // Import added
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "custom_id", nullable = false, unique = true)
    private String customId;

    @Column(nullable = false)
    private String name;
    
    // --- FIX START ---
    // Added 'cascade' so new Categories are saved automatically when you save an Item
    @ManyToOne(cascade = CascadeType.PERSIST) 
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    // --- FIX END ---
    
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;
    
    @Column(nullable = false)
    private Double price;
    
    @OneToMany(mappedBy = "item")
    @JsonIgnore
    private List<BillItem> billItems;
    
    public Item() {
    }
    
    public Item(String customId, String name, Category category, Integer stockQuantity, Double price) {
        this.customId = customId;
        this.name = name;
        this.category = category;
        this.stockQuantity = stockQuantity;
        this.price = price;
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCustomId() {
        return customId;
    }

    public void setCustomId(String customId) {
        this.customId = customId;
    }

    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public Integer getStockQuantity() {
        return stockQuantity;
    }
    
    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    
    public Double getPrice() {
        return price;
    }
    
    public void setPrice(Double price) {
        this.price = price;
    }
    
    public List<BillItem> getBillItems() {
        return billItems;
    }
    
    public void setBillItems(List<BillItem> billItems) {
        this.billItems = billItems;
    }
}