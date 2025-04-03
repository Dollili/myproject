package org.example.Repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface FileMapper {

    void insertFile(Map<String, Object> file);

    List<Map<String, Object>> getFileList(String no);

    @Update("UPDATE FILE SET DEL_YN = 'Y' WHERE ID = #{id}")
    void deleteFile(String id);

    @Update("UPDATE FILE SET DEL_YN = 'Y' WHERE BOARD_NO = #{no}")
    void deleteAll(String no);

}
