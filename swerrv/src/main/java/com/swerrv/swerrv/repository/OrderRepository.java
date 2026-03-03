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

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE o.status <> 'CANCELLED' AND o.status <> 'REFUNDED'")
    BigDecimal getTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.total), 0) FROM Order o WHERE MONTH(o.createdAt) = MONTH(CURRENT_DATE) AND YEAR(o.createdAt) = YEAR(CURRENT_DATE) AND o.status <> 'CANCELLED' AND o.status <> 'REFUNDED'")
    BigDecimal getMonthlyRevenue();

    List<Order> findTop5ByOrderByCreatedAtDesc();
}
