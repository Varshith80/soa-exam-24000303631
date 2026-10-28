package com.klef.soa.docker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.soa.docker.entity.SolarPanel;

public interface SolarPanelRepository extends JpaRepository<SolarPanel, Long>{

}
