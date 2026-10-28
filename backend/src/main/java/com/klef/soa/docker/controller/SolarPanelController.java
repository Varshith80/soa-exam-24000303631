package com.klef.soa.docker.controller;

import com.klef.soa.docker.entity.SolarPanel;
import com.klef.soa.docker.service.SolarPanelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = {
        "${app.cors.allowed-origin:http://localhost:5173}",
        "http://127.0.0.1:5173"
})
public class SolarPanelController {

    private final SolarPanelService solarPanelService;

    public SolarPanelController(SolarPanelService solarPanelService) {
        this.solarPanelService = solarPanelService;
    }

    @GetMapping("/")
    public String home() {
        return "SolarPanel CRUD Service is running";
    }

    @PostMapping("/Add")
    public SolarPanel addSolarPanel(
            @Valid @RequestBody SolarPanel solarPanel) {
        return solarPanelService.addSolarPanel(solarPanel);
    }

    @GetMapping("/DisplayAll")
    public List<SolarPanel> displayAllSolarPanels() {
        return solarPanelService.displayAllSolarPanels();
    }

    @DeleteMapping("/Delete/{id}")
    public String deleteSolarPanel(@PathVariable Long id) {
        solarPanelService.deleteSolarPanel(id);
        return "SolarPanel deleted successfully with ID: " + id;
    }

    @PutMapping("/Update/{id}")
    public ResponseEntity<SolarPanel> updateSolarPanel(
            @PathVariable Long id,
            @Valid @RequestBody SolarPanel solarPanel) {
        return ResponseEntity.of(solarPanelService.updateSolarPanel(id, solarPanel));
    }
}