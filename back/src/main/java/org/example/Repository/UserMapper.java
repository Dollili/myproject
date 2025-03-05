package org.example.Repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface UserMapper {

    String userLogin(Map<String, Object> user);

    //기본 USER 권한 부여
    @Insert("INSERT INTO USER (USER_ID, USER_PWD, USER_NM, REGISTER_DATE, ROLE) VALUES (#{id}, #{pwd}, #{name}, NOW(), 'U')")
    int insertUser(Map<String, Object> user);

}
