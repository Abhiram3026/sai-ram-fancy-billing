package com.sairam.billing.backend.dto;

import com.sairam.billing.backend.entity.BillItem;

import java.util.List;

public class BillSummaryResponse {

    private Long billId;
    private String customerName;
    private Double grandTotal;
    private List<BillItem> items;

    public Long getBillId() {
        return billId;
    }

    public void setBillId(Long billId) {
        this.billId = billId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Double getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(Double grandTotal) {
        this.grandTotal = grandTotal;
    }

    public List<BillItem> getItems() {
        return items;
    }

    public void setItems(List<BillItem> items) {
        this.items = items;
    }
}