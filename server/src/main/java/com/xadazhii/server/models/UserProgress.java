package com.xadazhii.server.models;

import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
@NoArgsConstructor 
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "material_id", nullable = false)
    private Material material;

    @Column(name = "completed_at", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant completedAt;

    @Column(name = "score")
    private Integer score;

    public UserProgress(User user, Material material) {
        this.user = user;
        this.material = material;
    }

    public UserProgress(User user, Material material, Integer score) {
        this.user = user;
        this.material = material;
        this.score = score;
    }
}
