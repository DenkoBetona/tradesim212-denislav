package com.denislav.tradesim.asset;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetRepository assetRepository;

    public AssetController(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    //GET /api/assets
    //Returns all assets
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Asset> getAllAssets() {
        try {
            return assetRepository.getAllAssets();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch assets", e);
        }
    }

    //POST /api/assets/update
    //Updates asset quantity
    @PostMapping("/update")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void updateAssetQuantity(@RequestParam int assetId, @RequestParam double quantity) {
        if (Double.isNaN(quantity) || Double.isInfinite(quantity)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quantity must be a valid number.");
        }
        try {
            assetRepository.updateAssetQuantity(assetId, quantity);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to update asset quantity", e);
        }
    }

    //POST /api/assets/reset
    //Resets all assets
    @PostMapping("/reset")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void resetAssets() {
        try {
            assetRepository.resetAllAssets();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to reset assets", e);
        }
    }
}