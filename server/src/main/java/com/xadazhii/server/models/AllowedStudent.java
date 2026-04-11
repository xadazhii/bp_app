package com.xadazhii.server.models;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import javax.persistence.*;

@Entity
@Table(name = "allowed_students")
@Getter
@Setter
@NoArgsConstructor
public class AllowedStudent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    public AllowedStudent(String email) {
        this.email = email;
    }
}