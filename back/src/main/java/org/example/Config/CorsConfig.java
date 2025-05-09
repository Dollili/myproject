package org.example.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${spring.graphql.cors.allowedOrigins}")
    private String allowedOrigins;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.addAllowedOrigin(allowedOrigins); // 허용할 URL
        config.addAllowedHeader("*"); // 허용할 Header
        config.addAllowedMethod("*"); // 허용할 Http Method

        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type", "Content-Disposition"));

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}