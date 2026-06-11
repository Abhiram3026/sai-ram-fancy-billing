package com.sairam.billing.backend.controller;

import com.sairam.billing.backend.dto.BillSummaryResponse;
import com.sairam.billing.backend.entity.Bill;
import com.sairam.billing.backend.entity.BillItem;
import com.sairam.billing.backend.repository.BillItemRepository;
import com.sairam.billing.backend.repository.BillRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bills")
public class BillController {

    private final BillRepository billRepository;
    private final BillItemRepository billItemRepository;

    public BillController(
            BillRepository billRepository,
            BillItemRepository billItemRepository) {

        this.billRepository = billRepository;
        this.billItemRepository = billItemRepository;
    }

    @PostMapping
    public Bill createBill(@RequestBody Bill bill) {
        return billRepository.save(bill);
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @GetMapping("/{billId}/summary")
    public BillSummaryResponse getBillSummary(
            @PathVariable Long billId) {

        Bill bill = billRepository.findById(billId)
                .orElseThrow(() ->
                        new RuntimeException("Bill not found"));

        List<BillItem> items =
                billItemRepository.findByBillId(billId);

        BillSummaryResponse response =
                new BillSummaryResponse();

        response.setBillId(bill.getId());
        response.setCustomerName(
                bill.getCustomerName());

        response.setGrandTotal(
                bill.getGrandTotal());

        response.setItems(items);

        return response;
    }
}