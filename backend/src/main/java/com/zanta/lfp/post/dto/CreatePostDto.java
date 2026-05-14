package com.zanta.lfp.post.dto;

import jakarta.validation.constraints.*;
//user creating post
public record CreatePostDto(
        @NotBlank(message = "Post title cannot be blank")
        @Size(max = 200, message = "Post title must be less than 200 characters")
        String title,

        @Size(max = 200, message = "Party code must be less than 2000 characters")
        String partyCode,

        @NotNull(message = "Team size cannot be null")
        @Min(value = 2, message = "Team size must be at least 2")
        int teamSize,

        @NotNull(message = "Game ID cannot be null")
        Integer gameId,

        String rank,

        Boolean voiceChat

) {}
