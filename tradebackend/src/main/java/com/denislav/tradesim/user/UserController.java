package com.denislav.tradesim.user;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET /api/users/balance
    // Returns the current balance
    @GetMapping("/balance")
    @ResponseStatus(HttpStatus.OK)
    public double getBalance() {
        try {
            return userRepository.getBalance();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch balance", e);
        }
    }

    // POST /api/users/balance
    // Updates the balance
    @PostMapping("/balance")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateBalance(@RequestParam double balance) {
        if (balance < 0 || Double.isNaN(balance)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Balance must be non-negative.");
        }
        try {
            userRepository.updateBalance(balance);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update balance", e);
        }
    }
}
