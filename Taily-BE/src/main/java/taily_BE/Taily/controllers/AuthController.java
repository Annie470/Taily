package taily_BE.Taily.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Logable;
import taily_BE.Taily.entities.UserMaintenance;
import taily_BE.Taily.exceptions.ValidationException;
import taily_BE.Taily.payloads.LoginDTO;
import taily_BE.Taily.payloads.LoginResponseDTO;
import taily_BE.Taily.payloads.NewDogOwnerDTO;
import taily_BE.Taily.payloads.NewUserMaintenanceDTO;
import taily_BE.Taily.services.AuthService;
import taily_BE.Taily.services.DogOwnerService;
import taily_BE.Taily.services.LogableService;
import taily_BE.Taily.services.UserMaintenanceService;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private DogOwnerService dogOwnerService;
    @Autowired
    private UserMaintenanceService userMaintenanceService;
    @Autowired
    private LogableService logableService;


    //POST REGISTER DOGOWNER
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public DogOwner register(@RequestBody @Validated NewDogOwnerDTO body, BindingResult validationResult) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }
        return this.dogOwnerService.save(body);
    }

    //POST LOGIN LOGABLE
    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody @Validated LoginDTO body, BindingResult validationResult) {
        if (validationResult.hasErrors()) {throw new ValidationException(validationResult.getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }
        String token =authService.checkUserAndGenerateToken(body);
        Logable found = logableService.findByEmail(body.email());
        return new LoginResponseDTO(token, found.getRole() );
    }

}
