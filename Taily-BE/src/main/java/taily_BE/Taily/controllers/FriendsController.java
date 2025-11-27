package taily_BE.Taily.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.services.FriendsService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/friends")
public class FriendsController {
    @Autowired
    private FriendsService friendsService;

    // GET FOLLOWING LIST
    @GetMapping("/following")
    @PreAuthorize("isAuthenticated()")
    public List<DogOwner> getMyFollowing(@AuthenticationPrincipal DogOwner currentUser) {
        return friendsService.getFollowingList(currentUser.getId());
    }

    // GET FOLLOWERS LIST
    @GetMapping("/followers")
    @PreAuthorize("isAuthenticated()")
    public List<DogOwner> getMyFollowers(@AuthenticationPrincipal DogOwner currentUser) {
        return friendsService.getFollowersList(currentUser.getId());
    }

    // FOLLOW USER
    @PostMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.OK)
    public DogOwner followUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal DogOwner currentUser) {
        return friendsService.followUser(currentUser.getId(), userId);
    }

    // UNFOLLOW USER
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ROLE_USER')")
    @ResponseStatus(HttpStatus.OK)
    public DogOwner unfollowUser(
            @PathVariable UUID userId,
            @AuthenticationPrincipal DogOwner currentUser) {
        return friendsService.unfollowUser(currentUser.getId(), userId);
    }

    // CHECK IF IS FRIEND
    @GetMapping("/check/{userId}")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Boolean> checkFollowing(
            @PathVariable UUID userId,
            @AuthenticationPrincipal DogOwner currentUser) {
        boolean isFollowing = friendsService.isFollowing(currentUser.getId(), userId);
        return Map.of("isFollowing", isFollowing);
    }

    // GET OWN STATS COUNT
    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Long> getStats(@AuthenticationPrincipal DogOwner currentUser) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("following", friendsService.getFollowingCount(currentUser.getId()));
        stats.put("followers", friendsService.getFollowersCount(currentUser.getId()));
        return stats;
    }

    // GET STATS COUNT OF ANOTHER USER
    @GetMapping("/stats/{userId}")
    @PreAuthorize("isAuthenticated()")
    public Map<String, Long> getUserStats(@PathVariable UUID userId) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("following", friendsService.getFollowingCount(userId));
        stats.put("followers", friendsService.getFollowersCount(userId));
        return stats;
    }

}
