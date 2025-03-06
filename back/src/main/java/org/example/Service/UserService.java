package org.example.Service;

import org.example.Repository.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserService {

    @Autowired
    private UserMapper userMapper;

    public Boolean userLogin(Map<String, Object> params) throws UsernameNotFoundException {
        String user = userMapper.userLogin(params);
        if (user == null) {
            throw new UsernameNotFoundException("user not found : " + params.get("id"));
        }
        return true;
    }

    public int register(Map<String, Object> params) {
        String pwd = params.get("pwd").toString();
        return userMapper.insertUser(params);
    }

}
