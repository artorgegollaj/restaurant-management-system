package com.ubt.restaurant;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ubt.restaurant.entity.*;
import com.ubt.restaurant.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrderControllerTest {

    @Autowired private MockMvc mvc;
    @Autowired private MenuItemRepository miRepo;
    @Autowired private MenuCategoryRepository catRepo;
    @Autowired private RestaurantTableRepository tableRepo;
    private final ObjectMapper om = new ObjectMapper();

    private Long miId;
    private Long tableId;

    @BeforeEach
    void seed() {
        MenuCategory c = new MenuCategory(); c.setName("Cat-" + System.nanoTime());
        catRepo.save(c);
        MenuItem mi = new MenuItem(); mi.setName("Pizza"); mi.setPrice(new BigDecimal("5.00"));
        mi.setCategory(c); mi.setAvailable(true);
        miRepo.save(mi);
        miId = mi.getId();

        RestaurantTable t = new RestaurantTable();
        t.setTableNumber((int)(System.nanoTime() % 9999));
        t.setCapacity(4); t.setStatus("FREE");
        tableRepo.save(t);
        tableId = t.getId();
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createOrderWithItems_calculatesTotal() throws Exception {
        var body = Map.of(
            "tableId", tableId,
            "orderType", "DINE_IN",
            "items", List.of(Map.of("menuItemId", miId, "quantity", 3, "notes", ""))
        );
        mvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(body)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.total").value(15.0))
            .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @WithMockUser(roles = "WAITER")
    void changeStatus_validTransition() throws Exception {
        // krijo porosi
        var body = Map.of(
            "tableId", tableId,
            "orderType", "DINE_IN",
            "items", List.of(Map.of("menuItemId", miId, "quantity", 1, "notes", ""))
        );
        var res = mvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(body)))
            .andReturn();
        Long id = ((Number) om.readValue(res.getResponse().getContentAsString(), Map.class).get("id")).longValue();

        // PENDING -> IN_PROGRESS = OK
        mvc.perform(patch("/api/orders/" + id + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(Map.of("status", "IN_PROGRESS"))))
            .andExpect(status().isOk());

        // IN_PROGRESS -> PAID = invalid
        mvc.perform(patch("/api/orders/" + id + "/status")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(Map.of("status", "PAID"))))
            .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(roles = "WAITER")
    void createOrder_emptyItems_returns400() throws Exception {
        var body = Map.of("tableId", tableId, "orderType", "DINE_IN", "items", List.of());
        mvc.perform(post("/api/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content(om.writeValueAsString(body)))
            .andExpect(status().isBadRequest());
    }
}
