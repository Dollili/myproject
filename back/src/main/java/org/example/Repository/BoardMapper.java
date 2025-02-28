package org.example.Repository;

import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {

    @Select("SELECT NO, TITLE, AUTHOR, RECOMMEND, VIEW_CNT, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d') AS APPLY_FORMAT_DATE FROM BOARD")
    List<Map<String, Object>> getBoardList();

    @Select("SELECT *, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d') AS APPLY_FORMAT_DATE FROM BOARD WHERE NO=#{no}")
    Map<String, Object> getBoardDetail(@Param("no") int no);

    /*@Insert()
    int insertBoard();

    @Delete()
    int deleteBoard();

    @Update()
    int updateBoard();*/
}
