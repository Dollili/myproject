package org.example.Service;

import org.example.Repository.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserMapper userMapper;
    Logger logger = LoggerFactory.getLogger(CustomOAuth2UserService.class);

    public CustomOAuth2UserService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        Map<String, Object> oAuth2User = super.loadUser(userRequest)
                .getAttributes();

        String registrationId = userRequest.getClientRegistration()
                .getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration()
                .getProviderDetails()
                .getUserInfoEndpoint()
                .getUserNameAttributeName();

        logger.info("registrationId: {}", registrationId);
        logger.info("userNameAttributeName: {}", userNameAttributeName);

        Map<String, Object> userAttributes = OAuth2Attribute(registrationId, userNameAttributeName, oAuth2User);

        String email = userAttributes.get("email").toString();

        Map<String, Object> user = userMapper.userLogin(email);
        // 사용자 정보가 없다면 회원가입 처리
        if (user == null) {
            int cnt = userMapper.insertUser(userAttributes);
            if (cnt == 1) {
                // 새로 가입한 사용자의 기본 권한 부여 (예: ROLE_USER)
                List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
                return new DefaultOAuth2User(authorities, userAttributes, userNameAttributeName);
            } else {
                // 가입 실패 시 예외 또는 null 처리
                throw new OAuth2AuthenticationException("회원가입 실패");
            }
        }

        // 기존 사용자일 경우
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.get("ROLE")));
        return new DefaultOAuth2User(authorities, userAttributes, userNameAttributeName);
    }

    private Map<String, Object> OAuth2Attribute(String provider, String attributeKey, Map<String, Object> attributes) {
        Map<String, Object> result = new HashMap<>();
        switch (provider) {
            case "google":
                result.put("nic", attributes.get("name"));
                result.put("email", attributes.get("email"));
                break;
            case "kakao":
                Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
                Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                result.put("nic", profile.get("nickname"));
                result.put("email", kakaoAccount.get("email"));
                break;
            case "naver":
                Map<String, Object> response = (Map<String, Object>) attributes.get("response");
                result.put("nic", response.get("name"));
                result.put("email", response.get("email"));
                break;
            default:
                throw new OAuth2AuthenticationException("Unsupported provider: " + provider);
        }
        result.put("provider", provider);
        result.put("key", attributeKey);
        return result;
    }
}
