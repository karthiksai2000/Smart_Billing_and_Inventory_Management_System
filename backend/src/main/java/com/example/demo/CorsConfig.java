package com.example.demo; // MAKE SURE THIS MATCHES YOUR PACKAGE NAME

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Apply to all endpoints
                        .allowedOriginPatterns("*") // ALLOWS ALL ORIGINS (Compatible with credentials)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // Allowed HTTP methods
                        .allowedHeaders("*") // Allowed headers
                        .allowCredentials(true); // Allow cookies/auth tokens
            }
        };
    }
}