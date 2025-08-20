package org.example.aopTest;

import org.example.common.aop.LoggingAspect;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false) // security 비활성화
public class AopTestClass {
    private static final Logger log = LoggerFactory.getLogger(AopTestClass.class);
    @Autowired
    private LoggingAspect loggingAspect;
    @Autowired
    private MockMvc mvc;

    @Test
    void check () {
        Assertions.assertNotNull(loggingAspect);
        System.out.println(">>> 확인");
    }

    @Test
    void helloEndpointAspect() throws Exception {
        mvc.perform(get("/hello")).andExpect(status().isOk()).andExpect(content().string("Hello AOP"));
        log.info(">>> 확인: ");
    }
}
