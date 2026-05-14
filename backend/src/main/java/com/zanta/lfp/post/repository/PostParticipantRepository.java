package com.zanta.lfp.post.repository;

import com.zanta.lfp.post.model.PostParticipant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostParticipantRepository extends JpaRepository<PostParticipant, Long> {
    Optional<PostParticipant> findByPostIdAndUserId(Long postId, Long userId);
    boolean existsByPostIdAndUserId(Long postId, Long userId);
    void deleteByPostIdAndUserId(Long postId, Long userId);

    void deleteByPostId(Long id);

    List<PostParticipant> findByUserId(Long id);
}

