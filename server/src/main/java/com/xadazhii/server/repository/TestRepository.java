package com.xadazhii.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.xadazhii.server.models.Test;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
}
