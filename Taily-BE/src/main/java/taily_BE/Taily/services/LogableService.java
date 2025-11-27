package taily_BE.Taily.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import taily_BE.Taily.entities.Logable;
import taily_BE.Taily.exceptions.NotFoundException;
import taily_BE.Taily.repositories.LogableRepository;

import java.util.Set;
import java.util.UUID;

@Service
public class LogableService {
    @Autowired
    private LogableRepository logableRepository;

    @Autowired
    private PasswordEncoder bcrypt;


    //GET SINGLE
    public Logable findById(UUID id) { return this.logableRepository.findById(id).orElseThrow(() -> new NotFoundException("Nessun user corrispondente a questo ID!"));}//:)
    public Logable findByEmail(String email) { return this.logableRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User inesistente o email incorretta"));}


}
