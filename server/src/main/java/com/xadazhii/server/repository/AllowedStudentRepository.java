package com.xadazhii.server.repository;

import com.xadazhii.server.models.AllowedStudent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Repository
public interface AllowedStudentRepository extends JpaRepository<AllowedStudent, Long> {
    Optional<AllowedStudent> findByEmail(String email);
    @Transactional
    void deleteByEmail(String email);
    boolean existsByEmail(String email);
}