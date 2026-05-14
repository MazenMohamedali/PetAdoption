package com.zanta.lfp.post.model;

import com.zanta.lfp.game.model.Game;
import com.zanta.lfp.user.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;


import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "post")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Post title cannot be blank")
    @Size(max = 200, message = "Post title must be less than 200 characters")
    @Column(nullable = false, length = 200)
    private String title;



    @Size(max = 200, message = "Party code must be less than 200 characters")
    @Column(length = 200)
    private String partyCode;


    @NotNull(message = "Team size cannot be null")
    @Min(value = 2, message = "Team size must be at least 2")
    @Column(nullable = false)
    private int teamSize; //handle ya omar  in service based on game model

    @Builder.Default
    @Column(nullable = false)
    private Integer currentPlayers = 0;


    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(optional = false)
    @JoinColumn(name = "game_id", nullable = false)
    private Game game;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;

    @Column(length = 50)
    private String playerRank;

    @Builder.Default
    @Column(nullable = false)
    private Boolean voiceChat = false;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        if (currentPlayers == null) currentPlayers = 0;
        if (active == null) active = true;
        if (voiceChat == null) voiceChat = false;
    }


}
