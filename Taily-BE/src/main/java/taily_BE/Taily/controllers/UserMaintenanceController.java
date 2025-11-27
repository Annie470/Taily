package taily_BE.Taily.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import taily_BE.Taily.entities.UserMaintenance;
import taily_BE.Taily.exceptions.ValidationException;
import taily_BE.Taily.payloads.NewUserMaintenanceDTO;
import taily_BE.Taily.services.UserMaintenanceService;

import java.util.UUID;

@RestController
@RequestMapping("/usermaintenance")
public class UserMaintenanceController {

    @Autowired
    private UserMaintenanceService userMaintenanceService;

    // DELETE OWN PROFILE
    @DeleteMapping("/me")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CHAIRMAN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteOwnProfile(@AuthenticationPrincipal UserMaintenance currentAuthenticatedUser) {
        this.userMaintenanceService.findAndDelete(currentAuthenticatedUser.getId());
    }

    // DELETE USER MAINTENANCE BY EMAIL
    @DeleteMapping("/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUserMaintenanceByEmail(@PathVariable String email) {
        UUID foundId= this.userMaintenanceService.findByEmail(email).getId();
        this.userMaintenanceService.findAndDelete(foundId);
    }

    //POST REGISTER USERMAINTENANCE
    @PostMapping("/admin/register")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public UserMaintenance registerChairman(@RequestBody @Validated NewUserMaintenanceDTO body, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }
        return this.userMaintenanceService.save(body);
    }

    //GET SEARCH BY EMAIL
    @GetMapping("/{email}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserMaintenance getUserMaintenanceByEmail(@PathVariable String email) {
        return this.userMaintenanceService.findByEmail(email);
    }
}
