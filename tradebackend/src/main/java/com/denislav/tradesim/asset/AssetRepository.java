package com.denislav.tradesim.asset;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AssetRepository {

    private final JdbcClient jdbcClient;

    public AssetRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public List<Asset> getAllAssets() {
        return jdbcClient.sql("SELECT * FROM assets ORDER BY id ASC")
                .query(Asset.class)
                .list();
    }

    public void updateAssetQuantity(int assetId, double quantity) {
        Double oldQuantity = jdbcClient.sql("SELECT quantity FROM assets WHERE id = :assetId")
            .param("assetId", assetId)
            .query(Double.class)
            .single();
        quantity = oldQuantity + quantity;
        jdbcClient.sql("UPDATE assets SET quantity = :quantity WHERE id = :assetId")
                .param("quantity", quantity)
                .param("assetId", assetId)
                .update();
    }

    public void resetAllAssets() {
        jdbcClient.sql("UPDATE assets SET quantity = 0.0").update();
    }
}