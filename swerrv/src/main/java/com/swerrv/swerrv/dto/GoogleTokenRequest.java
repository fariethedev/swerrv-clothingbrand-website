package com.swerrv.swerrv.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoogleTokenRequest {
    @NotBlank(message = "Google ID token cannot be blank")
    private String token;
}
