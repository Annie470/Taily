package taily_BE.Taily.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.entities.Post;
import taily_BE.Taily.entities.enums.Age;
import taily_BE.Taily.entities.enums.Sex;
import taily_BE.Taily.entities.enums.Size;
import taily_BE.Taily.exceptions.ValidationException;
import taily_BE.Taily.payloads.PostDTO;
import taily_BE.Taily.services.PostService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    //GET ALL
    @GetMapping("/all")
    @PreAuthorize("isAuthenticated()")
    public List<Post> findAll() {
        return this.postService.findAll();
    }

    //GET SINGLE BY ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER', 'ROLE_CHAIRMAN')")
    public Post findById(@PathVariable UUID id) {
        return postService.findById(id);
    }

    //GET ALL FILTER
    @GetMapping("/search")
    @PreAuthorize("isAuthenticated()")
    public List<Post> findAllFiltered(
            @RequestParam(required = false) String provincia,
            @RequestParam(required = false) LocalDateTime dateFrom,
            @RequestParam(required = false) Sex allowedSex,
            @RequestParam(required = false) Size allowedSize,
            @RequestParam(required = false) Age allowedAge) {
        return postService.searchWithFilter(provincia, dateFrom, allowedSex, allowedSize, allowedAge);
    }

    //POST
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.CREATED)
    public Post save(@RequestBody @Validated PostDTO body, BindingResult validationResult, @AuthenticationPrincipal DogOwner currentUser) {
        if (validationResult.hasErrors()) {
            throw new ValidationException(validationResult.getFieldErrors().stream().map(fieldError -> fieldError.getDefaultMessage()).toList());
        }
        return postService.save(body, currentUser);
    }

    //DELETE OWN
    @DeleteMapping("/{postId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_USER')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePost(@PathVariable UUID postId, @AuthenticationPrincipal DogOwner currentUser) {
        this.postService.deletePost(postId, currentUser.getId());
    }

    //DELETE ALL EXPIRED POSTS
    @DeleteMapping("/cleanup")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CHAIRMAN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cleanupExpiredPosts() {
        this.postService.deleteExpiredPosts();
    }

    //POST ADD TO GUESTS
    @PostMapping("/{postId}/guests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.OK)
    public Post addGuest(@PathVariable UUID postId, @AuthenticationPrincipal DogOwner currentUser) {
        return this.postService.addGuest(postId, currentUser);
    }

    //DELETE FROM GUESTS
    @DeleteMapping("/{postId}/guests")
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.OK)
    public Post deleteGuest(@PathVariable UUID postId, @AuthenticationPrincipal DogOwner currentUser) {
        return this.postService.deleteGuest(postId, currentUser);
    }

    //GET POST WHERE AUTHENTICATED IS AUTHOR OR GUEST
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<Post> findUserPosts(@AuthenticationPrincipal DogOwner currentUser) {
        return this.postService.findUserPosts(currentUser.getId());
    }

    //DELETE POST BY ADMIN/CHAIRMAN
    @DeleteMapping("/admin/{postId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CHAIRMAN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePostByAdmin(@PathVariable UUID postId) {
        this.postService.deletePostByAdmin(postId);
    }
}
