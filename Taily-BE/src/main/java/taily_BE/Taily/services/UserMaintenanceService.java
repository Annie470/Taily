package taily_BE.Taily.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import taily_BE.Taily.entities.UserMaintenance;
import taily_BE.Taily.exceptions.NotFoundException;
import taily_BE.Taily.exceptions.ValidationException;
import taily_BE.Taily.payloads.NewUserMaintenanceDTO;
import taily_BE.Taily.repositories.UserMaintenanceRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UserMaintenanceService {
    @Autowired
    private UserMaintenanceRepository userMaintenanceRepository;

    @Autowired
    private PasswordEncoder bcrypt;

    //GET SINGLE BY ID
    public UserMaintenance findById(UUID id) {
        return userMaintenanceRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Nessun risultato trovato!"));
    }
    //GET SINGLE BY EMAIL
    public UserMaintenance findByEmail(String email) {
        return userMaintenanceRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Nessun risultato trovato!"));
    }

    //POST
    public UserMaintenance save(NewUserMaintenanceDTO payload){
        List<String> errors = new ArrayList<>();
        if (userMaintenanceRepository.existsByEmail(payload.email())) {
            errors.add("Email gia in uso!");
        }
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
        UserMaintenance newUser = new UserMaintenance(payload.email(), bcrypt.encode(payload.password()), payload.fullName());
        this.userMaintenanceRepository.save(newUser);
        return newUser;
    }

    //DELETE
    public void findAndDelete(UUID id) {
        UserMaintenance found = this.findById(id);
        this.userMaintenanceRepository.delete(found);
    }
}
