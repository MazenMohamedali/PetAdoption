package com.zanta.lfp.user.service;


import com.zanta.lfp.post.model.Post;
import com.zanta.lfp.post.model.PostParticipant;
import com.zanta.lfp.post.repository.PostParticipantRepository;
import com.zanta.lfp.post.repository.PostRepository;
import com.zanta.lfp.user.Dto.UserDto;
import com.zanta.lfp.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import static com.zanta.lfp.user.enums.ERole.ADMIN;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PostParticipantRepository postParticipantRepository;
    private final PostRepository postRepository;

    public ResponseEntity<?> getAllUsers() {
        var users = userRepository.findAll();
        return ResponseEntity.ok(Map.of("users", users.stream()
                .map(UserDto::from)
                .toList()
        ));
    }

    public ResponseEntity<?> createAdminUser(Long id) {
        var user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        user.setRole(ADMIN);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).build(); // return created DTO in body
    }

    @Transactional
    public ResponseEntity<?> deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // 1. Delete all PostParticipant records where this user is a participant
        List<PostParticipant> userParticipants = postParticipantRepository.findByUserId(id);
        postParticipantRepository.deleteAll(userParticipants);

        // 2. Find all posts owned by this user
        List<Post> postsOwnedByUser = postRepository.findByOwnerId(id);

        // 3. For each post owned by this user, delete all its participants and then the post
        for (Post post : postsOwnedByUser) {
            // Delete all participants of this post
            postParticipantRepository.deleteByPostId(post.getId());
            // Delete the post
            postRepository.delete(post);
        }

        // 4. Finally, delete the user
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }
}
