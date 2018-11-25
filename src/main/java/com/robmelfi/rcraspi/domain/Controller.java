package com.robmelfi.rcraspi.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

import com.robmelfi.rcraspi.domain.enumeration.IO;

/**
 * A Controller.
 */
@Entity
@Table(name = "controller")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Controller implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "jhi_mode")
    private IO mode;

    @ManyToOne
    @JsonIgnoreProperties("")
    private Pin pin;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public Controller name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public IO getMode() {
        return mode;
    }

    public Controller mode(IO mode) {
        this.mode = mode;
        return this;
    }

    public void setMode(IO mode) {
        this.mode = mode;
    }

    public Pin getPin() {
        return pin;
    }

    public Controller pin(Pin pin) {
        this.pin = pin;
        return this;
    }

    public void setPin(Pin pin) {
        this.pin = pin;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Controller controller = (Controller) o;
        if (controller.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), controller.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Controller{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", mode='" + getMode() + "'" +
            "}";
    }
}