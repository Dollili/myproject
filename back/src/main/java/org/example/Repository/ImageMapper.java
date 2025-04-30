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

    @Select("SELECT *, DATE_FORMAT(APPLY_DATE, '%Y-%m-%d') AS APPLY_FORMAT_DATE FROM IMGBOARD WHERE NO=#{no}")
    Map<String, Object> getBoardDetail(Map<String, Object> no);

    @Update("UPDATE IMGBOARD SET VIEW_CNT = VIEW_CNT + 1 WHERE NO=#{no}")
    void viewCount(Map<String, Object> no);

    @Update("UPDATE IMGBOARD SET RECOMMEND = RECOMMEND + 1 WHERE NO=#{no}")
    int recommendUp(Map<String, Object> param);

    List<Map<String, Object>> getBoardComment(Map<String, Object> no);

    int insertBoard(Map<String, Object> param);

    @Update("UPDATE IMGBOARD SET DEL_YN = 'Y' WHERE NO=#{no}")
    int deleteBoard(Map<String, Object> param);

    int updateBoard(Map<String, Object> param);

    @Insert("INSERT INTO IMGCOMMENT (USER_ID, APPLY_DATE, COMMENT, BOARD_NO, USER_NIC, CATEGORY) VALUES (#{user}, NOW(), #{comment}, #{no}, #{nic}, #{category})")
    int insertComment(Map<String, Object> param);

    @Update("UPDATE IMGCOMMENT SET DEL_YN ='Y' WHERE ID=#{id} AND USER_ID=#{user}")
    int deleteComment(Map<String, Object> param);

    @Update("UPDATE IMGCOMMENT SET DEL_YN ='Y' WHERE BOARD_NO=#{no}")
    void deleteAllCom(String no);

    List<Map<String, Object>> selectRanking();
}
