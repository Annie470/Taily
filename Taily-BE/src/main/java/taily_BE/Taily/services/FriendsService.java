package taily_BE.Taily.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import taily_BE.Taily.entities.DogOwner;
import taily_BE.Taily.exceptions.BadRequestException;
import taily_BE.Taily.exceptions.NotFoundException;
import taily_BE.Taily.repositories.DogOwnerRepository;

import java.util.List;
import java.util.UUID;

@Service
public class FriendsService {
    @Autowired
    private DogOwnerRepository dogOwnerRepository;

    // GET FOLLOWED FRIENDS
    public List<DogOwner> getFollowingList(UUID userId) {
        DogOwner user = dogOwnerRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato con ID: " + userId));
        return user.getFriends();
    }

    // ADD FRIEND
    @Transactional
    public DogOwner followUser(UUID userId, UUID userToFollowId) {
        if (userId.equals(userToFollowId)) {
            throw new BadRequestException("Non puoi seguire te stesso!");
        }
        DogOwner user = dogOwnerRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato"));
        DogOwner userToFollow = dogOwnerRepository.findById(userToFollowId)
                .orElseThrow(() -> new NotFoundException("Utente da seguire non trovato"));
        if (user.getFriends().contains(userToFollow)) {
            throw new BadRequestException("Stai già seguendo questo utente!");
        }

        user.getFriends().add(userToFollow);
        dogOwnerRepository.save(user);
        return user;
    }

    // REMOVE FRIEND
    @Transactional
    public DogOwner unfollowUser(UUID userId, UUID userToUnfollowId) {
        DogOwner user = dogOwnerRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato"));
        DogOwner userToUnfollow = dogOwnerRepository.findById(userToUnfollowId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato"));
        if (!user.getFriends().contains(userToUnfollow)) {
            throw new BadRequestException("Non stai seguendo questo utente!");
        }

        user.getFriends().remove(userToUnfollow);
        dogOwnerRepository.save(user);
        return user;
    }

    // CHECK IS FRIEND?
    public boolean isFollowing(UUID userId, UUID potentialFollowedUserId) {
        DogOwner user = dogOwnerRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato"));
        return user.getFriends().stream()
                .anyMatch(friend -> friend.getId().equals(potentialFollowedUserId));
    }

    // GET FOLLOWERS LIST
    public List<DogOwner> getFollowersList(UUID userId) {
        DogOwner user = dogOwnerRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato"));
        return dogOwnerRepository.findAll().stream()
                .filter(dogOwner -> dogOwner.getFriends().contains(user))
                .toList();
    }



    // GET FOLLOWING COUNT
    public long getFollowingCount(UUID userId) {
        DogOwner user = dogOwnerRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Utente non trovato"));
        return user.getFriends().size();
    }
    // GET FOLLOWERS COUNT
    public long getFollowersCount(UUID userId) {
        return getFollowersList(userId).size();
    }
}
