package com.sairam.billing.backend.controller;

import com.sairam.billing.backend.entity.Product;
import com.sairam.billing.backend.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    @GetMapping("/barcode/{barcode}")
public Product getProductByBarcode(@PathVariable String barcode) {
    return productRepository.findByBarcode(barcode)
            .orElseThrow(() -> new RuntimeException("Product not found"));
}
@PutMapping("/{id}")
public Product updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {

    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    product.setBarcode(updatedProduct.getBarcode());
    product.setName(updatedProduct.getName());
    product.setPrice(updatedProduct.getPrice());
    product.setStock(updatedProduct.getStock());

    return productRepository.save(product);
}   
@DeleteMapping("/{id}")
public String deleteProduct(@PathVariable Long id) {
    productRepository.deleteById(id);
    return "Product deleted successfully";
}
}