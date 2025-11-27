package taily_BE.Taily.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Logable;
import taily_BE.Taily.entities.UserMaintenance;
import taily_BE.Taily.services.DogOwnerService;
import taily_BE.Taily.services.LogableService;
import taily_BE.Taily.services.UserMaintenanceService;

import java.util.UUID;

@RestController
@RequestMapping("/logable")
public class LogableController {

    @Autowired
    private LogableService logableService;

    @Autowired
    private DogOwnerService dogOwnerService;

    @Autowired
    private UserMaintenanceService userMaintenanceService;

    // GET USER BY EMAIL
    @GetMapping("/search/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public Logable getUserByEmail(@PathVariable String email) {
        return this.logableService.findByEmail(email);
    }

    // DELETE USER BY ID
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserById(@PathVariable UUID id) {
        Logable user = this.logableService.findById(id);

        if (user instanceof DogOwner) {
            this.dogOwnerService.findAndDeleteByAdmin(id);
        } else if (user instanceof UserMaintenance) {
            this.userMaintenanceService.findAndDelete(id);
        }
    }
}
