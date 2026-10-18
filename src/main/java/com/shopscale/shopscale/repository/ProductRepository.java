package com.shopscale.shopscale.repository;

import com.shopscale.shopscale.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {

}