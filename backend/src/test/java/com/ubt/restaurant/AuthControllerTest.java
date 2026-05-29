package com.ubt.restaurant;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private WebApplicationContext webContext;
    private MockMvc mvc;
    private final ObjectMapper om = new ObjectMapper();

    void setup() {
        mvc = MockMvcBuilders.webAppContextSetup(webContext).build();
    }

    @Test
    void registerLoginRefreshFlow() throws Exception {
        setup();
        String username = "test_" + System.currentTimeMillis();

        // register
        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(Map.of(
                    "username", username, "email", username + "@x.com", "password", "passw0rd"))))
            .andExpect(status().isOk());

        // login
        MvcResult login = mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(Map.of("username", username, "password", "passw0rd"))))
            .andExpect(status().isOk())
            .andReturn();

        Map<?, ?> body = om.readValue(login.getResponse().getContentAsString(), Map.class);
        String refresh = (String) body.get("refreshToken");
        assertNotNull(body.get("accessToken"));
        assertNotNull(refresh);

        // refresh
        mvc.perform(post("/api/auth/refresh")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(Map.of("refreshToken", refresh))))
            .andExpect(status().isOk());
    }
}
