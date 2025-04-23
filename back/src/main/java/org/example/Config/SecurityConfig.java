package org.example.Config;

import lombok.RequiredArgsConstructor;
import org.example.Filter.JwtAuthenticationFilter;
import org.example.Service.UserDetailService;
import org.example.util.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.SecurityContextHolderFilter;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfig corsConfig;
    //private final SessionFilter sessionFilter;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailService userDetailService;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                //.addFilterBefore(sessionFilter, SecurityContextPersistenceFilter.class)
                .authorizeHttpRequests(auth -> auth.requestMatchers("/auth/**", "/error")
                        .permitAll()
                        .requestMatchers("/board/**", "/file/**", "/files/**")
                        .hasAnyRole("U", "M")
                        .anyRequest()
                        .authenticated())
                .addFilterBefore(corsConfig.corsFilter(), SecurityContextHolderFilter.class)
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider, userDetailService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
