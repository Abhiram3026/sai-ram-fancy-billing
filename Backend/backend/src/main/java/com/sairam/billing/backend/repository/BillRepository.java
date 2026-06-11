package com.sairam.billing.backend.repository;

import com.sairam.billing.backend.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;



public interface BillRepository extends JpaRepository<Bill, Long> {
}