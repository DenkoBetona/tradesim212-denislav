package com.denislav.tradesim;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.denislav.tradesim.user.UserController;
import com.denislav.tradesim.user.UserRepository;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @Test
    void getBalance_returnsOk() throws Exception {
        when(userRepository.getBalance()).thenReturn(1000.0);
        mockMvc.perform(get("/api/users/balance"))
                .andExpect(status().isOk());
    }

    @Test
    void updateBalance_negativeBalance_returnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/users/balance")
                .param("balance", "-100"))
                .andExpect(status().isBadRequest());
    }
}