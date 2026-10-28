package com.klef.soa.docker.service;

import com.klef.soa.docker.entity.SolarPanel;
import java.util.List;
import java.util.Optional;

public interface SolarPanelService {

    SolarPanel addSolarPanel(SolarPanel solarPanel);

    List<SolarPanel> displayAllSolarPanels();

    void deleteSolarPanel(Long id);
    Optional<SolarPanel> updateSolarPanel(Long id, SolarPanel updatedSolarPanel);
}