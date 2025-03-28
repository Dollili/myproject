package org.example.Repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface FileMapper {

    int insertFile(Map<String, Object> file);
}
