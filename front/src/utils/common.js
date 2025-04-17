export const slugUtil = (str) => {
    return str.toLowerCase()
        .replace(/[^a-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, "")     // 특수문자 제거
        .replace(/\s+/g, "-")                 // 공백을 - 로 변환
        .replace(/^-+|-+$/g, "");   // 양쪽 끝의 - 제거
}