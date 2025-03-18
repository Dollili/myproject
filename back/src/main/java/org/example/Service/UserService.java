package org.example.Service;

import lombok.RequiredArgsConstructor;
import org.example.Repository.UserMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public int join(Map<String, Object> params) {
        if (params.get("id") == null || params.get("pwd") == null) {
            throw new RuntimeException("Required fields");
        }

        String password = bCryptPasswordEncoder.encode((String) params.get("pwd"));
        params.put("pwd", password);

        return userMapper.insertUser(params);
    }

    public String findUserId(Map<String, Object> params) {
        String userId = (String) params.get("id");
        Map<String, Object> user = userMapper.userInfo(userId);
        return user == null ? null : (String) user.get("USER_ID");
    }

    public Map<String, Object> findUserInfo(Map<String, Object> params) {
        String userId = (String) params.get("id");
        return userMapper.userInfo(userId);
    }

}
