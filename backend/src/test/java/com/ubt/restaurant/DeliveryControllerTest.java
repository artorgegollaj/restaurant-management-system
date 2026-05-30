package com.ubt.restaurant;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DeliveryControllerTest {

    @Autowired MockMvc mvc;

    @Test
    @WithMockUser(roles = "ADMIN")
    void listDeliveries_returns200() throws Exception {
        mvc.perform(get("/api/deliveries"))
           .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "WAITER")
    void create_invalidPhone_returns400() throws Exception {
        String body = "{\"orderId\":1,\"customerName\":\"Test\","
                    + "\"customerPhone\":\"abc\",\"address\":\"Rr. UBT\"}";
        mvc.perform(post("/api/deliveries")
                .contentType(MediaType.APPLICATION_JSON).content(body))
           .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(roles = "CHEF")
    void chefCannotCreate_returns403() throws Exception {
        String body = "{\"orderId\":1,\"customerName\":\"X\","
                    + "\"customerPhone\":\"044123456\",\"address\":\"Y\"}";
        mvc.perform(post("/api/deliveries")
                .contentType(MediaType.APPLICATION_JSON).content(body))
           .andExpect(status().isForbidden());
    }
}
