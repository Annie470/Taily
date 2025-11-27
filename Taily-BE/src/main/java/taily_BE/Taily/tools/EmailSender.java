package taily_BE.Taily.tools;


import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import taily_BE.Taily.entities.DogOwner;

@Component
@Slf4j
public class EmailSender {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(DogOwner user) {
    String text = "Ciao " + user.getUsername() + ",\nLa tua registrazione è stata completata con successo!\n\n Siamo felicissimi di darti il benvenuto nella Community di Taily!\n\nPronto a vivvere avventure con il tuo amico a quattro zampe?\n"+ user.getDogName() + " potrà:\n\n✓ Conoscere nuovi compagni di gioco nelle tue vicinanze\n✓ Creare amicizie indimenticabili\n✓ Organizzare appuntamenti di gioco\n✓ Condividere momenti speciali\n\nPronto per la prima avventura? Accedi all'app e inizia a esplorare!\n\n\nA presto,\nIl team di Taily.\n\n\nPS: Seguici sui social per non perdere eventi e novità!";

    try {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("🐾 Benvenuto in Taily! 🐾");
        message.setText(text);
        mailSender.send(message);
        log.info("Email sent successfully to: " + user.getEmail());
    } catch (MailAuthenticationException e) {
            log.error("Errore autenticazione. Controlla username/password SMTP", e);
    } catch (MailException e) {
        log.error("Failed to send email to: ", user.getEmail(), e);
    }
}

    public void sendDeleteEmail(DogOwner user) {
        String text = "Ciao " + user.getUsername() + " ,\n\n\nCi dispiace che le nostre strade si dividano...\n\nConfermiamo che il tuo account è stato eliminato con successo...\nSperiamo di rivederti in futuro!\n\n\nA presto,\nIl team di Taily.";

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("🐾 Un saluto da Taily! 🐾");
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent successfully to: " + user.getEmail());
        } catch (MailAuthenticationException e) {
            log.error("Errore autenticazione. Controlla username/password SMTP", e);
        } catch (MailException e) {
            log.error("Failed to send email to: ", user.getEmail(), e);
        }
    }

    public void sendReportEmail(DogOwner user) {
        String text = "Ciao " + user.getUsername() + " ,\n\nTi confermiamo che la tua segnalazione è stata presa in carico dal nostro team e la valuteremo con attenzione.\n\nSe hai ulteriori informazioni o bug da segnalare puoi scriverci all'email taily.app.info@gmail.com\n\n\nA presto,\nIl team di Taily.";

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("🐾 Segnalazione presa in carico! 🐾");
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent successfully to: " + user.getEmail());
        } catch (MailAuthenticationException e) {
            log.error("Errore autenticazione. Controlla username/password SMTP", e);
        } catch (MailException e) {
            log.error("Failed to send email to: ", user.getEmail(), e);
        }
    }

    public void sendDeletePostEmail(DogOwner user) {
        String text = "Ciao " + user.getUsername() + " ,\n\nTi informiamo che, dopo un'accurata valutazione da parte del nostro Team, il tuo post è stato rimosso.\n\nTi ricordiamo di rispettare i valori della Community di Taily e ti esortiamo a non violare i Termini e Condizioni.\n\nQualora ci fossimo sbagliati, puoi inoltrare un reclamo scrivendoci a taily.app.info@gmail.com\n\n\nA presto,\nIl team di Taily.";

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("🐾 Post rimosso per violazione dei Termini&Condizioni! 🐾");
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent successfully to: " + user.getEmail());
        } catch (MailAuthenticationException e) {
            log.error("Errore autenticazione. Controlla username/password SMTP", e);
        } catch (MailException e) {
            log.error("Failed to send email to: ", user.getEmail(), e);
        }
    }

    public void sendDeleteProfileByAdmin(DogOwner user) {
        String text = "Ciao " + user.getUsername() + " ,\n\n\nTi informiamo che il tuo account è stato permanentemente disattivato.\n\n\nAbbiamo riscontrato comportamenti non conformi alle regole della community di Taily, oltre che alla violazione dei nostri Termini e Condizioni.\n\n\nSaluti,\nIl team di Taily.";

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(user.getEmail());
            message.setSubject("🐾 Un saluto da Taily! 🐾");
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent successfully to: " + user.getEmail());
        } catch (MailAuthenticationException e) {
            log.error("Errore autenticazione. Controlla username/password SMTP", e);
        } catch (MailException e) {
            log.error("Failed to send email to: ", user.getEmail(), e);
        }
    }
}


