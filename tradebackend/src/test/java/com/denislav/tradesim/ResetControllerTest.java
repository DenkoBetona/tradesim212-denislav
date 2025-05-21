package com.denislav.tradesim;

import com.denislav.tradesim.asset.AssetRepository;
import com.denislav.tradesim.reset.ResetController;
import com.denislav.tradesim.transactions.TransactionRepository;
import com.denislav.tradesim.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ResetController.class)
class ResetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;
    @MockBean
    private AssetRepository assetRepository;
    @MockBean
    private TransactionRepository transactionRepository;

    @Test
    void reset_returnsNoContent() throws Exception {
        mockMvc.perform(post("/api/reset"))
                .andExpect(status().isNoContent());
        verify(userRepository).resetBalance();
        verify(assetRepository).resetAllAssets();
        verify(transactionRepository).deleteAllTransactions();
    }
}