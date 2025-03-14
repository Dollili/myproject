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

    public Map<String, Object> userLogin(Map<String, Object> params) {
        String pwd = (String) params.get("pwd");

        Map<String, Object> user = userMapper.userLogin(params);
        if (user == null) {
            return null;
        }

        String password = (String) user.get("USER_PWD");
        if (!bCryptPasswordEncoder.matches(pwd, password)) {
            return null;
        }
        return user;
    }

    public int join(Map<String, Object> params) {
        if (params.get("id") == null || params.get("pwd") == null) {
            throw new RuntimeException("Required fields");
        }

        String password = bCryptPasswordEncoder.encode((String) params.get("pwd"));
        params.put("pwd", password);

        return userMapper.insertUser(params);
    }

    public String findUserId(Map<String, Object> params) {
        Map<String, Object> user = userMapper.userInfo(params);
        return user == null ? null : (String) user.get("USER_ID");
    }

    public Map<String, Object> findUserInfo(Map<String, Object> params) {
        return userMapper.userInfo(params);
    }

}
