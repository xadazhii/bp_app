package com.xadazhii.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "system_settings")
@Getter
@Setter
@NoArgsConstructor
public class SystemSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "setting_key", unique = true, nullable = false)
    private String key;

    @Column(name = "setting_value")
    private String value;

    public SystemSetting(String key, String value) {
        this.key = key;
        this.value = value;
    }
}