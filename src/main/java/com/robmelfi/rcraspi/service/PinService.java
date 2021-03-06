package com.robmelfi.rcraspi.service;

import com.robmelfi.rcraspi.domain.Pin;
import com.robmelfi.rcraspi.repository.PinRepository;
import com.robmelfi.rcraspi.service.dto.PinDTO;
import com.robmelfi.rcraspi.service.mapper.PinMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Pin.
 */
@Service
@Transactional
public class PinService {

    private final Logger log = LoggerFactory.getLogger(PinService.class);

    private final PinRepository pinRepository;

    private final PinMapper pinMapper;

    public PinService(PinRepository pinRepository, PinMapper pinMapper) {
        this.pinRepository = pinRepository;
        this.pinMapper = pinMapper;
    }

    /**
     * Save a pin.
     *
     * @param pinDTO the entity to save
     * @return the persisted entity
     */
    public PinDTO save(PinDTO pinDTO) {
        log.debug("Request to save Pin : {}", pinDTO);

        Pin pin = pinMapper.toEntity(pinDTO);
        pin = pinRepository.save(pin);
        return pinMapper.toDto(pin);
    }

    /**
     * Get all the pins.
     *
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public List<PinDTO> findAll() {
        log.debug("Request to get all Pins");
        return pinRepository.findAll().stream()
            .map(pinMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one pin by id.
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<PinDTO> findOne(Long id) {
        log.debug("Request to get Pin : {}", id);
        return pinRepository.findById(id)
            .map(pinMapper::toDto);
    }

    /**
     * Delete the pin by id.
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        log.debug("Request to delete Pin : {}", id);
        pinRepository.deleteById(id);
    }
}
