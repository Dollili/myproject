package org.example.Repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {

    List<Map<String, Object>> getBoardList(Map<String, Object> params);

    @Select("SELECT *, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d') AS APPLY_FORMAT_DATE FROM BOARD WHERE NO=#{no}")
    Map<String, Object> getBoardDetail(Map<String, Object> no);

    @Update("UPDATE BOARD SET VIEW_CNT = VIEW_CNT + 1 WHERE NO=#{no}")
    void viewCount(Map<String, Object> no);

    @Update("UPDATE BOARD SET RECOMMEND = RECOMMEND + 1 WHERE NO=#{no}")
    int recommendUp(Map<String, Object> param);

    @Select("SELECT *, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d %H:%m:%s') AS APPLY_FORMAT_DATE " +
            "FROM COMMENT WHERE BOARD_NO=#{no} AND DEL_YN IS NULL")
    List<Map<String, Object>> getBoardComment(Map<String, Object> no);

    @Insert("INSERT INTO BOARD (TITLE, CONTENTS, AUTHOR, APPLY_DATE) VALUES (#{title},#{contents},#{author},NOW())")
    int insertBoard(Map<String, Object> param);

    @Update("UPDATE BOARD SET DEL_YN = 'Y' WHERE NO=#{no}")
    int deleteBoard(Map<String, Object> param);
/*
    @Update()
    int updateBoard();*/

    @Insert("INSERT INTO COMMENT (USER_NM, APPLY_DATE, COMMENT, BOARD_NO) VALUES (#{user}, NOW(), #{comment}, #{no})")
    int insertComment(Map<String, Object> param);

    @Update("UPDATE COMMENT SET DEL_YN ='Y' WHERE ID=#{id}")
    int deleteComment(Map<String, Object> param);
}
