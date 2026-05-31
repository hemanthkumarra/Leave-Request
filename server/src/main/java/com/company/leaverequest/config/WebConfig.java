package com.company.leaverequest.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");
        String[] origins = (allowedOriginsEnv != null && !allowedOriginsEnv.isEmpty()) 
                ? allowedOriginsEnv.split(",") 
                : new String[]{"http://localhost:5173"};

        registry.addMapping("/**")
                .allowedOrigins(origins)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
