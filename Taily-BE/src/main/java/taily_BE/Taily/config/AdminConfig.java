package taily_BE.Taily.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import taily_BE.Taily.entities.UserMaintenance;
import taily_BE.Taily.entities.enums.Role;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminConfig {

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.email}")
    private String adminEmail;

    @Autowired
    private PasswordEncoder bcrypt;

    @Bean
    public UserMaintenance admin() {
        return new UserMaintenance(adminEmail, bcrypt.encode(adminPassword), "Admin", Role.ADMIN);
    }
}
