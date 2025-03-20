package org.example.Repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface UserMapper {

    Map<String, Object> userLogin(String id);

    Map<String, Object> findUserId(String id);

    Map<String, Object> findUserNic(String nic);

    Map<String, Object> userInfo(Map<String, Object> user);

    @Insert("INSERT INTO USER (USER_NM, USER_ID, USER_PWD, REGISTER_DATE, ROLE, USER_NIC) VALUES (#{name}, #{id}, #{pwd}, NOW(), 'U', #{nic})")
    int insertUser(Map<String, Object> user);

}
