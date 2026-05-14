package com.zanta.lfp.post.repository;

import com.zanta.lfp.post.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByActiveTrue();
    List<Post> findByActiveTrueAndCreatedAtBefore(LocalDateTime dateTime);

    List<Post> findByOwnerId(Long id);
}
