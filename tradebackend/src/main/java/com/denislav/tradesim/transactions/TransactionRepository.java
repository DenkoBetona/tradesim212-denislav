package com.denislav.tradesim.transactions;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class TransactionRepository {
    private final JdbcClient jdbcClient;

    public TransactionRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public double getAveragePriceForAsset(int assetId) {
        return jdbcClient.sql("SELECT COALESCE(AVG(price), 0) FROM transactions WHERE asset_id = :assetId")
                .param("assetId", assetId)
                .query(Double.class)
                .single();
    }

    public List<Transaction> getAllTransactions() {
        return jdbcClient.sql("SELECT * FROM transactions ORDER BY transaction_date DESC")
                .query(Transaction.class)
                .list();
    }

    public void createTransaction(int assetId, String type, double price, double total, double amount, double profit) {
        jdbcClient.sql("INSERT INTO transactions (asset_id, type, price, total, amount, profit) VALUES (:assetId, :type, :price, :total, :amount, :profit)")
                .param("assetId", assetId)
                .param("type", type)
                .param("price", price)
                .param("total", total)
                .param("amount", amount)
                .param("profit", profit)
                .update();
    }

    public void deleteAllTransactions() {
        jdbcClient.sql("DELETE FROM transactions").update();
    }
}