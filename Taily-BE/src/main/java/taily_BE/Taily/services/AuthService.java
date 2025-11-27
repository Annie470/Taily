package taily_BE.Taily.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import taily_BE.Taily.entities.Logable;
import taily_BE.Taily.exceptions.UnauthorizedException;
import taily_BE.Taily.payloads.LoginDTO;
import taily_BE.Taily.security.JwtTools;

@Component
public class AuthService {
    @Autowired
    private JwtTools jwtTools;
    @Autowired
    private PasswordEncoder bcrypt;
    @Autowired
    private LogableService logableService;

    public String checkUserAndGenerateToken(LoginDTO body) {
        Logable found =logableService.findByEmail(body.email());
        if(bcrypt.matches(body.password(), found.getPassword())){
            return  jwtTools.createToken(found);
        } else {
            throw  new UnauthorizedException("Credenziali errate!");
        }
    }
}
