package com.klef.soa.exam.service;

import com.klef.soa.exam.entity.SolarPanel;
import java.util.List;

public interface SolarPanelService {

    SolarPanel addSolarPanel(SolarPanel solarPanel);

    List<SolarPanel> displayAllSolarPanels();

    void deleteSolarPanel(Long id);
}