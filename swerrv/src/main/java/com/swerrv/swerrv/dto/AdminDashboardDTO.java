package com.swerrv.swerrv.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDTO {
    private long totalOrders;
    private long pendingOrders;
    private long totalProducts;
    private long totalUsers;
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private List<OrderDTO> recentOrders;
}
