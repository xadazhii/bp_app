package com.xadazhii.server.repository;

import com.xadazhii.server.models.GlobalSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GlobalSettingsRepository extends JpaRepository<GlobalSettings, Long> {
}