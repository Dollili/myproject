package org.example.Repository;

import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {

    @Select("SELECT NO, TITLE, AUTHOR, RECOMMEND, VIEW_CNT, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d') " +
            "AS APPLY_FORMAT_DATE FROM BOARD ORDER BY APPLY_DATE DESC")
    List<Map<String, Object>> getBoardList();

    @Select("SELECT *, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d') AS APPLY_FORMAT_DATE FROM BOARD WHERE NO=#{no}")
    Map<String, Object> getBoardDetail(@Param("no") int no);

    @Update("UPDATE BOARD SET VIEW_CNT = VIEW_CNT + 1 WHERE NO=#{no}")
    void viewCount(@Param("no") int no);

    @Update("UPDATE BOARD SET RECOMMEND = RECOMMEND + 1 WHERE NO=#{no}")
    void recommendUp(Map<String, Object> param);

    @Select("SELECT *, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d %H:%m:%s') AS APPLY_FORMAT_DATE " +
            "FROM COMMENT WHERE BOARD_NO=#{no}")
    List<Map<String, Object>> getBoardComment(int no);

    @Insert("INSERT INTO BOARD (TITLE, CONTENTS, AUTHOR, APPLY_DATE) VALUES (#{title},#{contents},#{author},NOW())")
    int insertBoard(Map<String, Object> param);

/*    @Delete()
    int deleteBoard();

    @Update()
    int updateBoard();*/

    @Insert("INSERT INTO COMMENT (USER_NM, APPLY_DATE, COMMENT, BOARD_NO) VALUES (#{user}, NOW(), #{comment}, #{no})")
    int insertComment(Map<String, Object> param);

    @Delete("DELETE FROM COMMENT WHERE ID=#{id}")
    void deleteComment(@Param("id") int id);
}
