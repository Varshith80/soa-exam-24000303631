package com.klef.soa.exam.service;

import com.klef.soa.exam.entity.SolarPanel;
import com.klef.soa.exam.repository.SolarPanelRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolarPanelServiceImpl implements SolarPanelService {

    private final SolarPanelRepository solarPanelRepository;

    public SolarPanelServiceImpl(
            SolarPanelRepository solarPanelRepository) {
        this.solarPanelRepository = solarPanelRepository;
    }

    @Override
    public SolarPanel addSolarPanel(SolarPanel solarPanel) {
        return solarPanelRepository.save(solarPanel);
    }

    @Override
    public List<SolarPanel> displayAllSolarPanels() {
        return solarPanelRepository.findAll();
    }

    @Override
    public void deleteSolarPanel(Long id) {
        solarPanelRepository.deleteById(id);
    }
}