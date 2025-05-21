package com.denislav.tradesim;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import com.denislav.tradesim.asset.AssetController;
import com.denislav.tradesim.asset.AssetRepository;

import java.util.Collections;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AssetController.class)
class AssetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AssetRepository assetRepository;

    @Test
    void getAllAssets_returnsOk() throws Exception {
        when(assetRepository.getAllAssets()).thenReturn(Collections.emptyList());
        mockMvc.perform(get("/api/assets"))
                .andExpect(status().isOk());
    }

}