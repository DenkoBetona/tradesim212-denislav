package com.denislav.tradesim.transactions;

import java.time.LocalDateTime;

public record Transaction(
    Integer id, 
    Type type, 
    Integer assetId, 
    double price, 
    double total, 
    double amount, 
    double profit, 
    LocalDateTime transactionDate
) {}
