package taily_BE.Taily.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Logable;
import taily_BE.Taily.exceptions.ValidationException;
import taily_BE.Taily.payloads.PutDogOwnerDTO;
import taily_BE.Taily.payloads.PutPasswordDTO;
import taily_BE.Taily.services.DogOwnerService;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dogowners")
public class DogOwnerController {
    @Autowired
    private DogOwnerService dogOwnerService;

    //GET SINGLE OWN PROFILE
    @GetMapping("/me")
    public DogOwner getProfile(@AuthenticationPrincipal DogOwner currentAuthenticatedUser) {
        return currentAuthenticatedUser;
    }
    //GET SINGLE DOGOWNER BY USERNAME
    @GetMapping("/username/{username}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER', 'ROLE_CHAIRMAN')")
    public DogOwner getOtherProfile(@PathVariable String username) {
        return this.dogOwnerService.findByUsername(username);
    }
    //GET SINGLE DOGOWNER BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_CHAIRMAN')")
    public DogOwner getOtherProfileById(@PathVariable UUID id) {
        return this.dogOwnerService.findById(id);
    }

    //GET OWN FRIENDS
    @GetMapping("/me/friends")
    public List<DogOwner> getFriends(@AuthenticationPrincipal DogOwner currentAuthenticatedUser) {
        return this.dogOwnerService.getFriends(currentAuthenticatedUser.getId());
    }

    //PUT OWN PROFILE
    @PutMapping("/me")
    public DogOwner updateProfile(@AuthenticationPrincipal DogOwner currentAuthenticatedUser, @RequestBody @Validated PutDogOwnerDTO body, BindingResult validationResult) {
        if (validationResult.hasErrors()) {throw new ValidationException(validationResult.getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }
        return this.dogOwnerService.updateProfile(currentAuthenticatedUser.getId(), body);
    }
    // PATCH OWN PASSWORD
    @PatchMapping("/me/password")
    public DogOwner updateOwnPassword(@AuthenticationPrincipal DogOwner currentAuthenticatedUser, @RequestBody @Validated PutPasswordDTO body, BindingResult validationResult) {
        if (validationResult.hasErrors()) {throw new ValidationException(validationResult.getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }
        return this.dogOwnerService.updateOwnPassword(currentAuthenticatedUser.getId(), body);
    }

    // PATCH PASSWORD BY ADMIN
    @PatchMapping("/{id}/password/reset")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public DogOwner resetPasswordByAdmin(@PathVariable UUID id) {
        return this.dogOwnerService.resetPasswordByAdmin(id);
    }

    //DELETE OWN PROFILE
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@AuthenticationPrincipal DogOwner currentAuthenticatedUser) {
        this.dogOwnerService.findAndDelete(currentAuthenticatedUser.getId());
    }

    //PATCH LOGO
    @PatchMapping("/{id}/upload")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    public DogOwner uploadLogo(@PathVariable UUID id, @AuthenticationPrincipal Logable currentAuthenticatedUser, @RequestParam("avatar") MultipartFile file) throws IOException {
        return this.dogOwnerService.uploadLogo(file, id, currentAuthenticatedUser);
    }


}
