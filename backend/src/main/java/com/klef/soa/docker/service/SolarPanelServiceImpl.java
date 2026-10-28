package com.klef.soa.docker.service;

import com.klef.soa.docker.entity.SolarPanel;
import com.klef.soa.docker.repository.SolarPanelRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

    @Override
    public Optional<SolarPanel> updateSolarPanel(Long id, SolarPanel updatedSolarPanel) {
        return solarPanelRepository.findById(id).map(existingSolarPanel -> {
            existingSolarPanel.setManufacturer(updatedSolarPanel.getManufacturer());
            existingSolarPanel.setPanelModel(updatedSolarPanel.getPanelModel());
            existingSolarPanel.setUnitPrice(updatedSolarPanel.getUnitPrice());
            existingSolarPanel.setWattage(updatedSolarPanel.getWattage());
            return solarPanelRepository.save(existingSolarPanel);
        });
    }
}
