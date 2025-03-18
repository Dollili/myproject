package org.example.Repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface UserMapper {

    Map<String, Object> userLogin(String id);

    Map<String, Object> userInfo(String id);

    @Insert("INSERT INTO USER (USER_NM, USER_ID, USER_PWD, REGISTER_DATE, ROLE) VALUES (#{name}, #{id}, #{pwd}, NOW(), 'U')")
    int insertUser(Map<String, Object> user);

}
