package org.example.service;

import jakarta.mail.Message;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final StringRedisTemplate redisTemplate;

    Logger logger = LoggerFactory.getLogger(EmailService.class);

    private MimeMessage createMimeMessage(String pwd, String to) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        mimeMessage.addRecipients(Message.RecipientType.TO, to);
        mimeMessage.setSubject("인증메일 테스트", "UTF-8");

        String msgg = "<div style='margin: 100px auto; padding: 20px; max-width: 600px; font-family: Arial, sans-serif; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);'>"
                + "<p style='font-size: 16px; color: #555; text-align: center;'>"
                + "그림 그리기 사이트 <strong>I-CURSOR</strong>입니다.</p>"
                + "<hr style='border: 0; border-top: 1px solid #eee; margin: 20px 0;'>"
                + "<p style='font-size: 16px; color: #555; text-align: center;'>아래 인증코드를 입력해 주세요:</p>"
                + "<div style='text-align: center; margin: 20px 0;'>"
                + "<span style='display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; font-size: 24px; font-weight: bold; border-radius: 5px;'>"
                + pwd + "</span>"
                + "</div>"
                + "<p style='font-size: 14px; color: #999; text-align: center;'>"
                + "인증 코드는 5분 동안 유효합니다.</p>"
                + "<p style='font-size: 12px; color: #aaa; text-align: center;'>"
                + "감사합니다.<br><strong>I-CURSOR</strong> 팀</p>"
                + "</div>";
        mimeMessage.setText(msgg, "utf-8", "html");
        mimeMessage.setFrom(new InternetAddress("ad____da@naver.com", "I-CURSOR"));

        return mimeMessage;
    }

    public String send(String pwd, String to) throws Exception {
        logger.info("email: {}", to);
        MimeMessage mimeMessage = createMimeMessage(pwd, to);
        try {
            mailSender.send(mimeMessage);
        } catch (MailException es) {
            es.printStackTrace();
            return "";
        }
        setDataExpire(pwd, to, 5L);
        return "인증 코드가 발송되었습니다.";
    }

    public boolean getCode(String pwd) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(pwd));
    }

    public void setDataExpire(String pwd, String to, long expire) {
        redisTemplate.opsForSet().add(pwd, to);
        redisTemplate.expire(pwd, 5, TimeUnit.MINUTES);
    }

    public void deleteData(String pwd) {
        redisTemplate.delete(pwd);
    }
}
