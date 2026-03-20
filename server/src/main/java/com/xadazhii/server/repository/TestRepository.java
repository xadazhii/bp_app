package com.xadazhii.server.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.xadazhii.server.models.Test;
import java.util.List;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
    @Query("SELECT DISTINCT t FROM Test t LEFT JOIN FETCH t.questions")
    List<Test> findAllWithQuestions();
}
