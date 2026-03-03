package com.swerrv.swerrv.service;

import com.swerrv.swerrv.model.Order;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class ShippingService {

    public void generateShippingLabel(Order order) {
        // Mocking InPost / DPD logic
        // In reality, this would make an API call to the courier with the shipping
        // address and parcel details

        boolean useInPost = Math.random() > 0.5; // Randomly assign a courier for the mock

        String courier = useInPost ? "InPost" : "DPD";
        String trackingNumber = (useInPost ? "INP-" : "DPD-")
                + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String shippingLabelUrl = "https://mock-courier.com/tracking/" + trackingNumber;

        order.setCourier(courier);
        order.setTrackingNumber(trackingNumber);
        order.setShippingLabelUrl(shippingLabelUrl);
    }
}
