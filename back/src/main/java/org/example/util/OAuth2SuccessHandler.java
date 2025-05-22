package org.example.util;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate stringRedisTemplate;

    @Value("${app.cors.allowedOrigins}")
    private String allowedOrigins;

    public OAuth2SuccessHandler(JwtTokenProvider jwtTokenProvider, StringRedisTemplate stringRedisTemplate) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        List<String> roles = oAuth2User.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String username = (String) attributes.get("nic");
        String provider = (String) attributes.get("provider");
        username = ((String) attributes.get("nic")).isEmpty() ? email : username;
        System.out.println(attributes);

        String token = jwtTokenProvider.createToken(username, roles);
        String refreshToken = jwtTokenProvider.createRefreshToken(username);
        long maxAge = jwtTokenProvider.getValidityInMilliseconds() / 1000;
        long maxAge2 = jwtTokenProvider.refreshValidityInMilliseconds() / 1000;
        System.out.println(token);

        Cookie cookie = new Cookie("token", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // HTTPS 환경에서만 전달
        cookie.setPath("/");
        cookie.setMaxAge((int) maxAge); // 1시간
        response.addCookie(cookie);

        Cookie refreshCookie = new Cookie("refreshToken", refreshToken);
        refreshCookie.setHttpOnly(true);
        refreshCookie.setSecure(true); // HTTPS 환경에서만 전달
        refreshCookie.setPath("/");
        refreshCookie.setMaxAge((int) maxAge2); // 7일
        response.addCookie(refreshCookie);

        stringRedisTemplate.opsForValue()
                .set("RT:" + username, refreshToken, 7, TimeUnit.DAYS);

        String redirectUrl = UriComponentsBuilder.fromUriString("/")
                .build().toUriString();
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
