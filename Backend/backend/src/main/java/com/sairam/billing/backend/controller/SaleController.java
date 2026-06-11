package com.sairam.billing.backend.controller;

import com.sairam.billing.backend.entity.Sale;
import com.sairam.billing.backend.repository.SaleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
@CrossOrigin("*")
public class SaleController {

    private final SaleRepository saleRepository;

    public SaleController(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    @PostMapping
    public Sale saveSale(@RequestBody Sale sale) {
        return saleRepository.save(sale);
    }

    @GetMapping
    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
}