package com.xadazhii.server.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import java.time.Instant;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "materials")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank
    @Size(max = 255)
    @Column(name = "file_path")
    private String filePath;

    @NotBlank
    @Size(max = 50)
    @Column(name = "material_type")
    private String materialType;

    @Column(name = "upload_date", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant uploadDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploader_id")
    private User uploader;

    public String getType() {
        return materialType;
    }

    public void setType(String type) {
        this.materialType = type;
    }
}