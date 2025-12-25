package com.example.demo.repositories;

import com.example.demo.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Date;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByCashierId(Long cashierId);
    List<Bill> findByDateBetween(Date startDate, Date endDate);
}