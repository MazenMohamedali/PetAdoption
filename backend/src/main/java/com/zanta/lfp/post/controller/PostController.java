package com.zanta.lfp.post.controller;


import com.zanta.lfp.post.dto.CreatePostDto;
import com.zanta.lfp.post.service.PostService;
import com.zanta.lfp.user.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PostController {
    private final PostService postService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllPosts(@AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : null;
        return postService.getAllPosts(userId);
    }

    // Get post by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPost(@PathVariable Long id, @AuthenticationPrincipal User user) {
        Long userId = user != null ? user.getId() : null;
        return postService.getPost(id, userId);
    }


    @PostMapping
    public ResponseEntity<?> createPost(@Valid @RequestBody CreatePostDto dto,
                                        @AuthenticationPrincipal User user) {
        return postService.createPost(dto, user.getId());
    }

    // Delete post by ID (only owner can delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id,
                                        @AuthenticationPrincipal User user) {
        return postService.deletePost(id, user.getId());
    }

    // Join a post
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinPost(@PathVariable Long id,
                                      @AuthenticationPrincipal User user) {
        return postService.joinPost(id, user.getId());
    }

    // Cancel/Leave a post
    @PostMapping("/{id}/cancel-join")
    public ResponseEntity<?> cancelJoin(@PathVariable Long id,
                                        @AuthenticationPrincipal User user) {
        return postService.cancelJoin(id, user.getId());
    }
}

// localhost:8080/api/v1/posts/all  [GET]
// localhost:8080/api/v1/posts/{id}  [GET]
// localhost:8080/api/v1/posts  [POST]
// localhost:8080/api/v1/posts/{id}  [DELETE]
// localhost:8080/api/v1/posts/{id}/join  [POST]
// localhost:8080/api/v1/posts/{id}/cancel-join  [POST]