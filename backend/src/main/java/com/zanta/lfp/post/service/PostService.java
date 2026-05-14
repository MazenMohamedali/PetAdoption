package com.zanta.lfp.post.service;

import com.zanta.lfp.user.Dto.UserDto;
import com.zanta.lfp.game.model.Game;
import com.zanta.lfp.user.model.User;
import com.zanta.lfp.post.dto.CreatePostDto;
import com.zanta.lfp.post.dto.PostDto;
import com.zanta.lfp.post.model.Post;
import com.zanta.lfp.post.model.PostParticipant;
import com.zanta.lfp.post.repository.PostRepository;
import com.zanta.lfp.post.repository.PostParticipantRepository;
import com.zanta.lfp.game.repository.GameRepository;
import com.zanta.lfp.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final PostParticipantRepository postParticipantRepository;

    public ResponseEntity<?> createPost(CreatePostDto dto ,Long ownerId){
        //get user
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new IllegalArgumentException("User not found (we don't have USER with this ID)"));
        //get game
        Game game = gameRepository.findById(dto.gameId())
                .orElseThrow(() -> new IllegalArgumentException("Game not found (there is no game with this ID )"));
        //validate team size
        if (dto.teamSize() > game.getPlayers()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Team size cannot exceed max players of the game ")); // add the max players for this game here
        }
        //creating post
        Post post = Post.builder()
                .title(dto.title())
                .partyCode(dto.partyCode())
                .teamSize(dto.teamSize())
                .currentPlayers(0)
                .owner(owner)
                .game(game)
                .createdAt(LocalDateTime.now())
                .active(true)
                .playerRank(dto.rank())
                .voiceChat(dto.voiceChat() != null ? dto.voiceChat() : false)
                .build();

        postRepository.save(post);

        return ResponseEntity.ok(Map.of("message", "Post created successfully", "post", mapToDto(post, ownerId)));

    }

    @Transactional
    public ResponseEntity<?> getAllPosts(Long userId) {
        // First, deactivate posts older than 6 hours
        deactivateOldPosts();
        
        // Get only active posts
        List<PostDto> posts = postRepository.findByActiveTrue()
                .stream()
                .map(post -> mapToDto(post, userId))
                .toList();

        return ResponseEntity.ok(Map.of("posts", posts));
    }

    @Transactional
    protected void deactivateOldPosts() {
        LocalDateTime sixHoursAgo = LocalDateTime.now().minusHours(6);
        List<Post> oldPosts = postRepository.findByActiveTrueAndCreatedAtBefore(sixHoursAgo);
        for (Post post : oldPosts) {
            post.setActive(false);
            postRepository.save(post);
        }
    }

    public ResponseEntity<?> getPost(Long id, Long userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found , no post with this Id"));
        return ResponseEntity.ok(Map.of("post", mapToDto(post, userId)));
    }

    @Transactional
    public ResponseEntity<?> deletePost(Long id, Long userId) {

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        boolean isOwner = post.getOwner().getId().equals(userId);
        boolean isAdmin = user.getRole().name().equals("ADMIN");

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(403)
                    .body(Map.of("error", "You are not allowed to delete this post"));
        }

        postRepository.delete(post);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }

    @Transactional
    public ResponseEntity<?> joinPost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user is the creator
        if (post.getOwner().getId().equals(userId)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "You are the creator, you are already in"));
        }

        // Check if user has already joined
        if (postParticipantRepository.existsByPostIdAndUserId(postId, userId)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "You have already joined this post"));
        }

        // Check if post is full
        if (post.getCurrentPlayers() >= post.getTeamSize()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Post is full"));
        }

        // Check if post is active
        if (!post.getActive()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Post is no longer active"));
        }

        // Create participant record
        PostParticipant participant = PostParticipant.builder()
                .post(post)
                .user(user)
                .build();
        postParticipantRepository.save(participant);

        // Increment current players
        post.setCurrentPlayers(post.getCurrentPlayers() + 1);
        postRepository.save(post);

        return ResponseEntity.ok(Map.of(
                "message", "You joined successfully",
                "post", mapToDto(post, userId)
        ));
    }

    @Transactional
    public ResponseEntity<?> cancelJoin(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user is the creator
        if (post.getOwner().getId().equals(userId)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "You are the creator, you cannot leave your own post"));
        }

        // Check if user has joined
        if (!postParticipantRepository.existsByPostIdAndUserId(postId, userId)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "You have not joined this post"));
        }

        // Remove participant
        postParticipantRepository.deleteByPostIdAndUserId(postId, userId);

        // Decrement current players
        post.setCurrentPlayers(Math.max(0, post.getCurrentPlayers() - 1));
        postRepository.save(post);

        return ResponseEntity.ok(Map.of(
                "message", "You left the post successfully",
                "post", mapToDto(post, userId)
        ));
    }

    // Mapper
    private PostDto mapToDto(Post post, Long userId) {
        boolean hasJoined = userId != null && postParticipantRepository.existsByPostIdAndUserId(post.getId(), userId);
        return new PostDto(
                post.getId(),
                post.getTitle(),
                post.getPartyCode(),
                post.getTeamSize(),
                post.getCurrentPlayers(),
                UserDto.from(post.getOwner()),
                post.getGame(),
                post.getCreatedAt(),
                post.getActive(),
                post.getPlayerRank(),
                post.getVoiceChat(),
                hasJoined
        );
    }

}
