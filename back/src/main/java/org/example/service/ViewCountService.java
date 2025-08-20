package org.example.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class ViewCountService {
    private final StringRedisTemplate redisTemplate;

    public boolean hasUserPost(String userId, String postId, String category) {
        String key = category + userId;
        return Boolean.TRUE.equals(redisTemplate.opsForSet()
                .isMember(key, postId));
    }

    public void markUserPost(String userId, String postId, String category) {
        String key = category + userId;
        redisTemplate.opsForSet().add(key, postId);
        if (!category.equals("recommendBoard") && !category.equals("recommendImg")) {
            redisTemplate.expire(key, 1, TimeUnit.DAYS);
        }
    }
}
