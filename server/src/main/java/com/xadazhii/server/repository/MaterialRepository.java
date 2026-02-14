package com.xadazhii.server.repository;

import com.xadazhii.server.models.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    long countByMaterialType(String materialType);
}