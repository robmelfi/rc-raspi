package com.robmelfi.rcraspi.repository;

import com.robmelfi.rcraspi.domain.Controller;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;


/**
 * Spring Data  repository for the Controller entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ControllerRepository extends JpaRepository<Controller, Long> {
    Controller findByPinName(String pinName);

    List<Controller> findByTimerId(Long timerId);
}
