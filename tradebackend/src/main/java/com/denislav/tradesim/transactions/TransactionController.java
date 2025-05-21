package com.denislav.tradesim.transactions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    // GET /api/transactions
    // Returns all transactions
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Transaction> getAllTransactions() {
        try {
            return transactionRepository.getAllTransactions();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch transactions", e);
        }
    }

    // PUT /api/transactions
    // Creates a new transaction
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void createTransaction(
        @RequestParam int assetId, @RequestParam String type,
        @RequestParam double price, @RequestParam double amount) {
        if (amount <= 0 || Double.isNaN(amount)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive.");
        }
        if (!type.equalsIgnoreCase("buy") && !type.equalsIgnoreCase("sell")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Type must be 'buy' or 'sell'.");
        }
        if (price <= 0 || Double.isNaN(price)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price must be positive.");
        }
        try {
            double profit = 0.0;
            if ("sell".equalsIgnoreCase(type)) {
                double averagePrice = transactionRepository.getAveragePriceForAsset(assetId);
                profit = (price - averagePrice) * amount;
            }
            transactionRepository.createTransaction(assetId, type, price, price * amount, amount, profit);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create transaction", e);
        }
    }

    // DELETE /api/transactions
    // Deletes all transactions
    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAllTransactions() {
        try {
            transactionRepository.deleteAllTransactions();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to delete transactions", e);
        }
    }
}