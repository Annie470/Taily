package taily_BE.Taily.services;


import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Logable;
import taily_BE.Taily.entities.Post;
import taily_BE.Taily.entities.UserMaintenance;
import taily_BE.Taily.entities.enums.Role;
import taily_BE.Taily.exceptions.BadRequestException;
import taily_BE.Taily.exceptions.NotFoundException;
import taily_BE.Taily.exceptions.UnauthorizedException;
import taily_BE.Taily.exceptions.ValidationException;
import taily_BE.Taily.payloads.NewDogOwnerDTO;
import taily_BE.Taily.payloads.PutDogOwnerDTO;
import taily_BE.Taily.payloads.PutPasswordDTO;
import taily_BE.Taily.repositories.DogOwnerRepository;
import taily_BE.Taily.repositories.PostRepository;
import taily_BE.Taily.tools.EmailSender;

import java.io.IOException;
import java.util.*;

@Service
public class DogOwnerService {

    @Autowired
    private DogOwnerRepository dogOwnerRepository;

    @Autowired
    private PasswordEncoder bcrypt;

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private Cloudinary imageUploader;

    @Autowired
    private PostRepository postRepository;

    private static final long MAX_SIZE = 5 * 948 * 948;
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpg",
            "image/png",
            "image/jpeg"
    );



    //GET SINGLE BY ID
    public DogOwner findById(UUID id) {
        return dogOwnerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("DogOwner non trovato con ID: " + id));
    }
    //GET SINGLE BY USERNAME
    public DogOwner findByUsername(String username) {
        return dogOwnerRepository.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("DogOwner non trovato con username: " + username));
    }

    //GET FRIENDS LIST
    public List<DogOwner> getFriends(UUID userId) {
        DogOwner user = findById(userId);
        return user.getFriends();
    }

    //POST
    public DogOwner save(NewDogOwnerDTO payload){
        List<String> errors = new ArrayList<>();
        if (dogOwnerRepository.existsByEmail(payload.email())) {
            errors.add("Email gia in uso!");
        }
        if(dogOwnerRepository.existsByUsername(payload.username())) {
            errors.add("Username gia in uso!");
        }
        if (!errors.isEmpty()) {
            throw new ValidationException(errors);
        }
       DogOwner newUser = new DogOwner(payload.email(), bcrypt.encode(payload.password()), payload.username(), payload.dogName(), payload.sex(), payload.size(), payload.age(), payload.bio());
        String emailPrefix = payload.email().split("@")[0];
        newUser.setAvatar("https://ui-avatars.com/api/?name=" + emailPrefix);
        this.dogOwnerRepository.save(newUser);
        try {
            emailSender.sendRegistrationEmail(newUser);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return newUser;
    }

    //DELETE OWN
    @Transactional
    public void findAndDelete(UUID id) {
        DogOwner found = this.findById(id);
        found.getFriends().clear();
        dogOwnerRepository.save(found);

        List<DogOwner> allUsers = dogOwnerRepository.findAll();
        for (DogOwner user : allUsers) {
            if (user.getFriends().removeIf(friend -> friend.getId().equals(id))) {
                dogOwnerRepository.save(user);
            }
        }
        postRepository.removeGuestFromAllPosts(id);

        List<Post> userPosts = postRepository.findByAuthor(found);
        postRepository.deleteAll(userPosts);

        this.dogOwnerRepository.delete(found);
        this.emailSender.sendDeleteEmail(found);
    }

    //DELETE USER BY ADMIN
    @Transactional
    public void findAndDeleteByAdmin(UUID id) {
        DogOwner found = this.findById(id);
        found.getFriends().clear();
        dogOwnerRepository.save(found);

        List<DogOwner> allUsers = dogOwnerRepository.findAll();
        for (DogOwner user : allUsers) {
            if (user.getFriends().removeIf(friend -> friend.getId().equals(id))) {
                dogOwnerRepository.save(user);
            }
        }
        postRepository.removeGuestFromAllPosts(id);

        List<Post> userPosts = postRepository.findByAuthor(found);
        postRepository.deleteAll(userPosts);

        this.dogOwnerRepository.delete(found);
        this.emailSender.sendDeleteProfileByAdmin(found);
    }

    //PUT
    public DogOwner updateProfile(UUID id, PutDogOwnerDTO payload) {
        DogOwner found = this.findById(id);
        this.dogOwnerRepository.findByEmail(payload.email()).ifPresent(user -> {if(!user.getId().equals(id)) {
            throw new BadRequestException("Email gia in utilizzo da altro utente!");
        }});
        this.dogOwnerRepository.findByUsername(payload.username()).ifPresent(user -> {if(!user.getId().equals(id)) {
            throw new BadRequestException("Username gia in utilizzo da altro utente!");
        }});
        found.setEmail(payload.email());
        found.setUsername(payload.username());
        found.setDogName(payload.dogName());
        found.setAge(payload.age());
        found.setBio(payload.bio());
        return dogOwnerRepository.save(found);
    }
    // PATCH PASSWORD OWN PROFILE
    public DogOwner updateOwnPassword(UUID id, PutPasswordDTO payload) {
        DogOwner found = this.findById(id);
        found.setPassword(bcrypt.encode(payload.password()));
        return dogOwnerRepository.save(found);
    }

    // PATCH PASSWORD BY ADMIN (Reset to default)
    public DogOwner resetPasswordByAdmin(UUID targetId) {
        DogOwner found = this.findById(targetId);
        found.setPassword(bcrypt.encode("Password1234"));
        return dogOwnerRepository.save(found);
    }


    //PATCH AVATAR
    public DogOwner uploadLogo(MultipartFile file, UUID targetId, Logable currentUser) {
        boolean isAdmin = currentUser instanceof UserMaintenance &&
                (currentUser.getRole().equals(Role.ADMIN)) ;
        if (!isAdmin  && !currentUser.getId().equals(targetId)) {
            throw new UnauthorizedException("Non sei autorizzato a modificare questo avatar!");
        }
        DogOwner found = this.findById(targetId);
        if(file.isEmpty()) throw new BadRequestException("File vuoto!");
        if(file.getSize() > MAX_SIZE) throw new BadRequestException("Dimensioni file troppo pesanti!");
        if(!ALLOWED_TYPES.contains(file.getContentType()))
            throw new BadRequestException("Formato non valido! Solo JPG, JPEG, PNG");
        try {
            Map result = imageUploader.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String imageUrl = (String) result.get("url");
            found.setAvatar(imageUrl);
            this.dogOwnerRepository.save(found);
            return found;
        } catch (IOException ex) {
            throw new RuntimeException("Errore durante l'upload dell'immagine", ex);
        }
    }
}
