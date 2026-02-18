package com.xadazhii.server.repository;

import com.xadazhii.server.models.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Set;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    boolean existsByUserIdAndMaterialId(Long userId, Long materialId);

    @Query("SELECT up.material.id FROM UserProgress up WHERE up.user.id = :userId")
    Set<Long> findCompletedMaterialIdsByUserId(Long userId);

    @Query("SELECT COUNT(up) FROM UserProgress up WHERE up.user.id = :userId AND up.material.materialType = :materialType")
    long countCompletedByUserAndType(Long userId, String materialType);

    @Query("SELECT up.user.id, up.material.materialType, COUNT(up) FROM UserProgress up WHERE up.material.materialType IN ('lecture', 'seminar') GROUP BY up.user.id, up.material.materialType")
    java.util.List<Object[]> countCompletedLearningMaterialsByUserAndType();
}
