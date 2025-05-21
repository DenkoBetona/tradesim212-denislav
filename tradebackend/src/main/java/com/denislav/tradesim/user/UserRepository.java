package com.denislav.tradesim.user;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {

    private final JdbcClient jdbcClient;

    public UserRepository(JdbcClient jdbcClient) {
        this.jdbcClient = jdbcClient;
    }

    public double getBalance() {
        return jdbcClient.sql("SELECT balance FROM users")
                .query(Double.class)
                .single();
    }
    public void updateBalance(double balance) {
        jdbcClient.sql("UPDATE users SET balance = :balance")
                .param("balance", balance)
                .update();
    }

    public void resetBalance() {
        jdbcClient.sql("UPDATE users SET balance = 10000.00")
                .update();
    }
}