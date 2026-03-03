package com.swerrv.swerrv.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        @Value("${app.cors.allowed-origins}")
        private String allowedOrigins;

        @Override
        public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                                // Split comma-separated list from properties
                                .allowedOrigins(allowedOrigins.split(","))
                                .allowedMethods(
                                                HttpMethod.GET.name(),
                                                HttpMethod.POST.name(),
                                                HttpMethod.PUT.name(),
                                                HttpMethod.PATCH.name(),
                                                HttpMethod.DELETE.name(),
                                                HttpMethod.OPTIONS.name())
                                .allowedHeaders(
                                                HttpHeaders.AUTHORIZATION,
                                                HttpHeaders.CONTENT_TYPE,
                                                HttpHeaders.ACCEPT,
                                                "X-Requested-With")
                                .exposedHeaders(HttpHeaders.AUTHORIZATION)
                                .allowCredentials(true)
                                .maxAge(3600);
        }
}
