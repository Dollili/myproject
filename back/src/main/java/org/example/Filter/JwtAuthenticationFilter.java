package org.example.Filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.Service.CustomOAuth2UserService;
import org.example.util.JwtTokenProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;
    private final CustomOAuth2UserService customOAuth2UserService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("token")) {
                    String token = cookie.getValue();
                    if (jwtTokenProvider.validateToken(token)) {
                        String username = jwtTokenProvider.getUsername(token);
                        String provider = jwtTokenProvider.getProvider(token);
                        Authentication auth;
                        // OAuth2User customUser = customOAuth2UserService.loadUser();

                        if ("local".equals(provider)) {
                            System.out.println("### hihihi");
                            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                            auth = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        } else {
                            Map<String, String> attributes = new HashMap<>();
                            attributes.put("username", username);
                            attributes.put("provider", provider);
                            OAuth2User oAuth2User =
                                    auth = new UsernamePasswordAuthenticationToken(oAuth2User, null, oAuth2User.getAuthorities());
                        }
                        SecurityContextHolder.getContext()
                                .setAuthentication(auth);
                    }
                }
            }
        }
        filterChain.doFilter(request, response);
    }
}
