package org.example.Repository;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;
import java.util.Map;

@Mapper
public interface ImageMapper {

    @Select("SELECT MAX(NO) FROM IMGBOARD")
    Integer boardMax();

    List<Map<String, Object>> getBoardList(Map<String, Object> params);

    int getBoardListCnt(Map<String, Object> params);

    @Select("SELECT NO, TITLE, DRAWINFO, DRAWTIME, RECOMMEND, VIEW_CNT, IMG_PATH, IMG_NM, CASE"
            + "        WHEN U.IS_DEL = 'Y' THEN '탈퇴한 사용자'"
            + "        ELSE U.USER_NIC"
            + "        END AS AUTHOR, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d') AS APPLY_FORMAT_DATE FROM IMGBOARD JOIN USER U ON U.USER_ID = IMGBOARD.USER_ID WHERE NO = #{no}")
    Map<String, Object> getBoardDetail(Map<String, Object> no);

    @Update("UPDATE IMGBOARD SET VIEW_CNT = VIEW_CNT + 1 WHERE NO = #{no}")
    void viewCount(Map<String, Object> no);

    @Update("UPDATE IMGBOARD SET RECOMMEND = RECOMMEND + 1 WHERE NO = #{no}")
    void recommendUp(String no);

    List<Map<String, Object>> getBoardComment(Map<String, Object> params);

    int insertBoard(Map<String, Object> param);

    @Update("UPDATE IMGBOARD SET DEL_YN = 'Y' WHERE NO = #{no}")
    int deleteBoard(Map<String, Object> param);

    int updateBoard(Map<String, Object> param);

    @Insert("INSERT INTO IMGCOMMENT (USER_ID, APPLY_DATE, COMMENT, BOARD_NO, CATEGORY) VALUES (#{user}, NOW(), #{comment}, #{no}, #{category})")
    int insertComment(Map<String, Object> param);

    @Update("UPDATE IMGCOMMENT SET DEL_YN ='Y' WHERE ID = #{id} AND USER_ID = #{user}")
    int deleteComment(Map<String, Object> param);

    @Update("UPDATE IMGCOMMENT SET DEL_YN ='Y' WHERE BOARD_NO = #{no}")
    void deleteAllCom(String no);

    List<Map<String, Object>> selectRanking();

    List<Map<String, Object>> getBoardRComment(Map<String, Object> params);

    @Insert("INSERT INTO IMGCOMMENT (USER_ID, APPLY_DATE, COMMENT, BOARD_NO, CATEGORY) VALUES (#{user}, NOW(), #{comment}, #{no}, #{category})")
    int insertRComment(Map<String, Object> param);

    @Update("UPDATE IMGCOMMENT SET DEL_YN ='Y' WHERE ID = #{id} AND USER_ID = #{user}")
    int deleteRComment(Map<String, Object> param);
}
