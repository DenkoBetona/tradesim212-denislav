package com.denislav.tradesim.reset;

import com.denislav.tradesim.asset.AssetRepository;
import com.denislav.tradesim.transactions.TransactionRepository;
import com.denislav.tradesim.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/reset")
public class ResetController {

    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final TransactionRepository transactionRepository;

    public ResetController(UserRepository userRepository, AssetRepository assetRepository, TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.transactionRepository = transactionRepository;
    }

    // POST /api/reset
    // Resets all data using the pre-existing
    // repository methods for user, asset, and transaction
    @PostMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reset() {
        try {
            userRepository.resetBalance();
            assetRepository.resetAllAssets();
            transactionRepository.deleteAllTransactions();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to reset all data", e);
        }
    }
}