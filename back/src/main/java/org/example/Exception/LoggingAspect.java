package org.example.Exception;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LoggingAspect {
    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    public LoggingAspect() {
        System.out.println("Testttt");
    }

    @Around("execution(* org.example.controller..*(..))")
    public Object logRequestResponse(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println("TEST");
        log.info(">>> Request: {}", joinPoint.getSignature());
        Object result = joinPoint.proceed();
        log.info("<<< Response: {}", result);
        return result;
    }
}
