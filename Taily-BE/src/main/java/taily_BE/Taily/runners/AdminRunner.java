package taily_BE.Taily.runners;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import taily_BE.Taily.entities.UserMaintenance;
import taily_BE.Taily.repositories.UserMaintenanceRepository;

@Component
@Slf4j
public class AdminRunner implements CommandLineRunner {
    @Autowired
    private UserMaintenanceRepository userMaintenanceRepository;

    @Autowired
    private UserMaintenance admin;

    @Override
    public void run(String... args) throws Exception {
        if (!userMaintenanceRepository.existsByEmail(admin.getEmail())) {
            userMaintenanceRepository.save(admin);
            log.info("Admin aggiunto al database!");
        } else {
            log.warn("Benvenuto Admin!");
        }
    }
}

