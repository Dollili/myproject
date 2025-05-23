package org.example.Repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface BoardMapper {

    @Select("SELECT MAX(NO) FROM BOARD")
    Integer boardMax();

    List<Map<String, Object>> getBoardList(Map<String, Object> params);

    int getBoardListCnt(Map<String, Object> params);

    @Select("SELECT NO, TITLE, CONTENTS, RECOMMEND, VIEW_CNT, CATEGORY,  CASE" +
            "        WHEN U.IS_DEL = 'Y' THEN '탈퇴한 사용자'" +
            "        ELSE U.USER_NIC" +
            "        END AS AUTHOR, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d') AS APPLY_FORMAT_DATE FROM BOARD JOIN USER U ON U.USER_ID = BOARD.USER_ID WHERE NO=#{no}")
    Map<String, Object> getBoardDetail(Map<String, Object> no);

    @Update("UPDATE BOARD SET VIEW_CNT = VIEW_CNT + 1 WHERE NO = #{no}")
    void viewCount(String no);

    @Update("UPDATE BOARD SET RECOMMEND = RECOMMEND + 1 WHERE NO = #{no}")
    int recommendUp(String no);

    List<Map<String, Object>> getBoardComment(Map<String, Object> no);

    int insertBoard(Map<String, Object> param);

    @Update("UPDATE BOARD SET DEL_YN = 'Y' WHERE NO = #{no}")
    int deleteBoard(Map<String, Object> param);

    int updateBoard(Map<String, Object> param);

    @Insert("INSERT INTO COMMENT (USER_ID, APPLY_DATE, COMMENT, BOARD_NO, CATEGORY) VALUES (#{user}, NOW(), #{comment}, #{no}, #{category})")
    int insertComment(Map<String, Object> param);

    @Update("UPDATE COMMENT SET DEL_YN ='Y' WHERE ID =#{id} AND USER_ID = #{user}")
    int deleteComment(Map<String, Object> param);

    @Update("UPDATE COMMENT SET DEL_YN ='Y' WHERE BOARD_NO = #{no}")
    void deleteAllCom(String no);
}
