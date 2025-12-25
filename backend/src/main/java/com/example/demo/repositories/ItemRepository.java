package com.example.demo.repositories;

import com.example.demo.entities.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByNameContaining(String name);
    List<Item> findByCategoryId(Long categoryId);
    List<Item> findByStockQuantityLessThan(Integer quantity);
    Optional<Item> findByCustomId(String customId);
}