package com.xadazhii.server.repository;

import com.xadazhii.server.models.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
    long countByMaterialType(String materialType);

    java.util.List<Material> findByWeekNumber(Integer weekNumber);

    @Modifying
    @Query("UPDATE Material m SET m.uploader = null WHERE m.uploader.id = :userId")
    void setUploaderToNull(Long userId);
}
