package com.example.demo.services;

import com.example.demo.entities.Category;
import com.example.demo.entities.Item;
import com.example.demo.repositories.CategoryRepository;
import com.example.demo.repositories.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CategoryRepository categoryRepository; // Injected to fix duplicate error

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Optional<Item> getItemById(Long id) {
        return itemRepository.findById(id);
    }

    // Allowed categories enforced for Hardware store
    private static final List<String> ALLOWED_CATEGORIES = List.of("Hardware", "Plumbing", "Electrical");

    private Category ensureAllowedCategory(String nameInput) {
        if (nameInput == null) {
            throw new RuntimeException("Category is required");
        }
        String normalized = nameInput.trim();
        // Match ignoring case to one of the allowed labels
        String canonical = ALLOWED_CATEGORIES.stream()
                .filter(a -> a.equalsIgnoreCase(normalized))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Category must be one of: " + String.join(", ", ALLOWED_CATEGORIES)));

        return categoryRepository.findByName(canonical)
                .orElseGet(() -> categoryRepository.save(new Category(canonical)));
    }

    // Create uses customId upsert semantics: if customId exists, increase stock; else create new
    public Item createItem(Item item) {
        if (item.getCustomId() == null || item.getCustomId().trim().isEmpty()) {
            throw new RuntimeException("customId is required");
        }

        Optional<Item> existing = itemRepository.findByCustomId(item.getCustomId().trim());
        if (existing.isPresent()) {
            Item current = existing.get();
            int add = Optional.ofNullable(item.getStockQuantity()).orElse(0);
            current.setStockQuantity((current.getStockQuantity() == null ? 0 : current.getStockQuantity()) + add);
            return itemRepository.save(current);
        }

        // New item path
        if (item.getCategory() == null || item.getCategory().getName() == null) {
            throw new RuntimeException("Category is required");
        }
        Category allowed = ensureAllowedCategory(item.getCategory().getName());
        item.setCategory(allowed);
        return itemRepository.save(item);
    }

    public Item updateItem(Long id, Item itemDetails) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));

        // Preserve customId; allow update if provided but different (optional)
        if (itemDetails.getCustomId() != null && !itemDetails.getCustomId().trim().isEmpty()) {
            item.setCustomId(itemDetails.getCustomId().trim());
        }
        item.setName(itemDetails.getName());
        item.setStockQuantity(itemDetails.getStockQuantity());
        item.setPrice(itemDetails.getPrice());

        // Handle Category update safely
        if (itemDetails.getCategory() != null) {
            Category allowed = ensureAllowedCategory(itemDetails.getCategory().getName());
            item.setCategory(allowed);
        }

        return itemRepository.save(item);
    }

    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        itemRepository.delete(item);
    }

    public List<Item> getItemsByCategory(Long categoryId) {
        return itemRepository.findByCategoryId(categoryId);
    }

    public List<Item> searchItems(String name) {
        return itemRepository.findByNameContaining(name);
    }

    public List<Item> getLowStockItems() {
        // Low stock: 1..20
        return itemRepository.findAll().stream()
                .filter(i -> Optional.ofNullable(i.getStockQuantity()).orElse(0) > 0
                        && Optional.ofNullable(i.getStockQuantity()).orElse(0) <= 20)
                .toList();
    }

    public Item updateStock(Long id, Integer quantity) {
        Item item = itemRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));

        item.setStockQuantity(item.getStockQuantity() + quantity);
        return itemRepository.save(item);
    }
}