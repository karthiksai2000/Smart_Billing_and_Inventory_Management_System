package com.example.demo.entities;

import java.util.Date;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;

@Entity
@Table(name = "bills")
public class Bill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date date;
    
    @ManyToOne
    @JoinColumn(name = "cashier_id", nullable = false)
    private User cashier;
    
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL)
    private List<BillItem> billItems;
    
    @Column(nullable = false)
    private Boolean refunded = false;
    
    @Column
    @Temporal(TemporalType.TIMESTAMP)
    private Date refundedDate;
    
    public Bill() {
    }
    
    public Bill(Date date, User cashier) {
        this.date = date;
        this.cashier = cashier;
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Date getDate() {
        return date;
    }
    
    public void setDate(Date date) {
        this.date = date;
    }
    
    public User getCashier() {
        return cashier;
    }
    
    public void setCashier(User cashier) {
        this.cashier = cashier;
    }
    
    public List<BillItem> getBillItems() {
        return billItems;
    }
    
    public void setBillItems(List<BillItem> billItems) {
        this.billItems = billItems;
    }
    
    public Boolean getRefunded() {
        return refunded;
    }
    
    public void setRefunded(Boolean refunded) {
        this.refunded = refunded;
    }
    
    public Date getRefundedDate() {
        return refundedDate;
    }
    
    public void setRefundedDate(Date refundedDate) {
        this.refundedDate = refundedDate;
    }
    
    // Helper method to calculate total amount (excluding refunded items)
    public Double getTotalAmount() {
        if (billItems == null) return 0.0;
        return billItems.stream()
                .filter(bi -> !bi.getRefunded())
                .mapToDouble(bi -> bi.getPrice() * bi.getQuantity())
                .sum();
    }
    
    // Helper method to get original total (including refunded items)
    public Double getOriginalTotal() {
        if (billItems == null) return 0.0;
        return billItems.stream()
                .mapToDouble(bi -> bi.getPrice() * bi.getQuantity())
                .sum();
    }
    
    // Check if bill is fully refunded
    public Boolean isFullyRefunded() {
        if (billItems == null || billItems.isEmpty()) return false;
        return billItems.stream().allMatch(bi -> bi.getRefunded());
    }
}
