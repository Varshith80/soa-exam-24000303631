package com.klef.soa.exam.controller;

import com.klef.soa.exam.entity.SolarPanel;
import com.klef.soa.exam.service.SolarPanelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
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
            @RequestBody SolarPanel solarPanel) {
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
}