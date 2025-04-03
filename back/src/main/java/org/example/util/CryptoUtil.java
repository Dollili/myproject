package org.example.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class CryptoUtil {
    static Logger logger = LoggerFactory.getLogger(CryptoUtil.class);

    public static String encryptSHA256(String str) {
        try {
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] hash = sha256.digest(str.getBytes());
            StringBuilder hexString = new StringBuilder();

            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            logger.error("NoSuchAlgorithmException", e);
            throw new RuntimeException("SHA-256 암호화 오류", e);
        }
    }
}
