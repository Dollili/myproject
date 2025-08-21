package org.example.service;

import org.example.repository.UserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class UserDetailService implements UserDetailsService {
    private final UserMapper userMapper;
    Logger logger = LoggerFactory.getLogger(UserDetailService.class);

    public UserDetailService(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Map<String, Object> user = userMapper.userLogin(username);
        if (user == null) {
            logger.info("loadUserByUsername: 사용자 이름이 존재하지 않음");
            throw new UsernameNotFoundException(username);
        }

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.get("ROLE")));

        return new org.springframework.security.core.userdetails.User((String) user.get("USER_ID")
                , (String) user.get("USER_PWD"), authorities);
    }
}
