package taily_BE.Taily.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import taily_BE.Taily.entities.Comune;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Post;
import taily_BE.Taily.entities.enums.Age;
import taily_BE.Taily.entities.enums.Sex;
import taily_BE.Taily.entities.enums.Size;
import taily_BE.Taily.exceptions.NotFoundException;
import taily_BE.Taily.exceptions.UnauthorizedException;
import taily_BE.Taily.payloads.PostDTO;
import taily_BE.Taily.repositories.*;
import taily_BE.Taily.specifications.PostSpecification;
import taily_BE.Taily.exceptions.BadRequestException;
import taily_BE.Taily.tools.EmailSender;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;
    @Autowired
    private ComuneRepository comuneRepository;
    @Autowired
    private ProvinciaRepository provinciaRepository;
    @Autowired
    private DogOwnerRepository dogOwnerRepository;
    @Autowired
    private ReportRepository reportRepository;
    @Autowired
    private EmailSender emailSender;
    @Autowired
    private  ChatMessageRepository chatMessageRepository;

    //POST
    public Post save(PostDTO payload, DogOwner currentUser) {
        Comune comune = comuneRepository.findById(payload.codiceIstat())
                .orElseThrow(() -> new RuntimeException("Comune non trovato"));
        Post newPost = new Post(currentUser, payload.street(), payload.date(),  payload.note(), comune, payload.allowedDogSex(), payload.allowedDogSize(), payload.allowedDogAge());
        return  this.postRepository.save(newPost);
    }

    //GET ALL
    public List<Post> findAll() {
        return this.postRepository.findAll((Sort.by(Sort.Direction.DESC, "date")));
    }

    //GET POST BY ID
    public Post findById( UUID id) {
        return postRepository.findById(id).orElseThrow(()-> new NotFoundException("Post non trovato in DB!") );
    }
    //GET WITH FILTER
    public List<Post> searchWithFilter(
            String  siglaProvincia,
            LocalDateTime dateFrom,
            Sex allowedSex,
            Size allowedSize,
            Age allowedAge) {
        Specification<Post> spec = (root, query, builder) -> builder.conjunction();

        if (siglaProvincia != null && !siglaProvincia.isEmpty()) {
            spec = spec.and(PostSpecification.provinciaEquals(siglaProvincia));
        }
        if (dateFrom != null) {
            spec = spec.and(PostSpecification.dateAfter(dateFrom));
        }
        if (allowedSex != null) {
            spec = spec.and(PostSpecification.allowedSexEquals(allowedSex));
        }
        if (allowedSize != null) {
            spec = spec.and(PostSpecification.allowedSizeEquals(allowedSize));
        }
        if (allowedAge != null) {
            spec = spec.and(PostSpecification.allowedAgeEquals(allowedAge));
        }
        return postRepository.findAll(spec);
    }


    //DELETE OWN
    @Transactional
    public void deletePost(UUID postId, UUID currentUserId) {
        Post post = postRepository.findById(postId).orElseThrow(() -> new NotFoundException("Post non trovato"));
        if (!post.getAuthor().getId().equals(currentUserId)) {
            throw new UnauthorizedException("Non sei autorizzato ad eliminare questo post!");
        } else {
            chatMessageRepository.deleteByPost(post);
            postRepository.delete(post);
        }
    }

    //DELETE ALL EXPIRED POSTS
    @Transactional
     public void deleteExpiredPosts() {
        LocalDateTime now = LocalDateTime.now();
        List<Post> expiredPosts = postRepository.findByDateBefore(now);
        expiredPosts.forEach(post -> {
            chatMessageRepository.deleteByPost(post);
            reportRepository.deleteByPost(post);
        });
        postRepository.deleteByDateBefore(now);
    }


    //POST ADD GUESTS
    public Post addGuest(UUID postId, DogOwner currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post non trovato"));
        if (post.getAuthor().getId().equals(currentUser.getId())) {
         throw new BadRequestException("Non puoi aggiungerti come guest al tuo stesso post!");
        }
        if (post.getGuests().contains(currentUser)) {
            throw new BadRequestException("Sei gia nella lista partecipanti!");
        }
        post.getGuests().add(currentUser);
        return postRepository.save(post);
    }

    //DELETE FROM GUESTS
    public Post deleteGuest(UUID postId, DogOwner currentUser) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post non trovato"));
        if (!post.getGuests().contains(currentUser)) {
            throw new BadRequestException("Non sei nella lista partecipanti!");
        }
        post.getGuests().remove(currentUser);
        return postRepository.save(post);
    }

    //GET POST WHERE AUTHENTICATED IS AUTHOR OR GUEST
    public List<Post> findUserPosts(UUID userId) {
        return this.postRepository.findPostsByAuthorOrParticipant(userId);
    }

    //DELETE POST BY ADMIN
    @Transactional
    public void deletePostByAdmin(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post non trovato"));
        chatMessageRepository.deleteByPost(post);
        reportRepository.deleteByPost(post);
        post.getGuests().clear();
        postRepository.save(post);
        postRepository.delete(post);
        emailSender.sendDeletePostEmail(post.getAuthor());
    }

}
