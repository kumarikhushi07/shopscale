
package com.shopscale.shopscale.repository;

import com.shopscale.shopscale.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}

