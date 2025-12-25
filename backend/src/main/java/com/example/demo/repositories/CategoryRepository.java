package com.example.demo.repositories;

import com.example.demo.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional; // Import this

public interface CategoryRepository extends JpaRepository<Category, Long> {
    // Add this line to find categories by their name
    Optional<Category> findByName(String name);
    boolean existsByName(String name);
    List<Category> findByNameContaining(String name);
}