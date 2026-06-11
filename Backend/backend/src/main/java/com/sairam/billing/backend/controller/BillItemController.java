package com.sairam.billing.backend.controller;

import com.sairam.billing.backend.entity.BillItem;
import com.sairam.billing.backend.entity.Product;
import com.sairam.billing.backend.repository.BillItemRepository;
import com.sairam.billing.backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import com.sairam.billing.backend.repository.BillRepository;
import com.sairam.billing.backend.entity.Bill;
import com.sairam.billing.backend.repository.BillRepository;
@RestController
@RequestMapping("/bill-items")
public class BillItemController {

    private final BillItemRepository billItemRepository;
    private final ProductRepository productRepository;
    private final BillRepository billRepository;

    public BillItemController(
        BillItemRepository billItemRepository,
        ProductRepository productRepository,
        BillRepository billRepository) {

    this.billItemRepository = billItemRepository;
    this.productRepository = productRepository;
    this.billRepository = billRepository;
}

    @PostMapping
    public BillItem addBillItem(@RequestBody BillItem billItem) {

        Product product = productRepository.findById(
                billItem.getProductId())
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if(product.getStock() < billItem.getQuantity()) {
            throw new RuntimeException("Insufficient stock");
        }

        product.setStock(
                product.getStock() - billItem.getQuantity());

        productRepository.save(product);

        billItem.setPrice(product.getPrice());
        billItem.setItemName(product.getName());

        billItem.setTotal(
                product.getPrice() * billItem.getQuantity());

        Bill bill = billRepository.findById(billItem.getBillId())
        .orElseThrow(() -> new RuntimeException("Bill not found"));

double grandTotal = billItemRepository.findByBillId(
        billItem.getBillId())
        .stream()
        .mapToDouble(BillItem::getTotal)
        .sum();

grandTotal += billItem.getTotal();

bill.setGrandTotal(grandTotal);

billRepository.save(bill);

        return billItemRepository.save(billItem);
    }
    
}