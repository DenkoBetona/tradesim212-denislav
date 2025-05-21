package com.denislav.tradesim;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.denislav.tradesim.transactions.TransactionController;
import com.denislav.tradesim.transactions.TransactionRepository;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionRepository transactionRepository;

    @Test
    void getAllTransactions_returnsOk() throws Exception {
        when(transactionRepository.getAllTransactions()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk());
    }

    @Test
    void createTransaction_invalidAmount_returnsBadRequest() throws Exception {
        mockMvc.perform(put("/api/transactions")
                .param("assetId", "1")
                .param("type", "buy")
                .param("price", "100")
                .param("amount", "-5"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createTransaction_invalidType_returnsBadRequest() throws Exception {
        mockMvc.perform(put("/api/transactions")
                .param("assetId", "1")
                .param("type", "invalid")
                .param("price", "100")
                .param("amount", "1"))
                .andExpect(status().isBadRequest());
    }
}