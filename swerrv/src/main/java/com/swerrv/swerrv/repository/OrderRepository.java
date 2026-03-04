package com.swerrv.swerrv.repository;

import com.swerrv.swerrv.model.Order;
import com.swerrv.swerrv.model.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Order> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<Order> findByStatusOrderByCreatedAtDesc(OrderStatus status, Pageable pageable);

    long countByStatus(OrderStatus status);

    @Query(value = "SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE o.status NOT IN ('CANCELLED', 'REFUNDED')", nativeQuery = true)
    BigDecimal getTotalRevenue();

    @Query(value = "SELECT COALESCE(SUM(o.total), 0) FROM orders o WHERE MONTH(o.created_at) = MONTH(CURDATE()) AND YEAR(o.created_at) = YEAR(CURDATE()) AND o.status NOT IN ('CANCELLED', 'REFUNDED')", nativeQuery = true)
    BigDecimal getMonthlyRevenue();

    List<Order> findTop5ByOrderByCreatedAtDesc();
}
