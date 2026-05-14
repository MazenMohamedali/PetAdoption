package com.zanta.lfp.post.dto;

import com.zanta.lfp.game.model.Game;
import com.zanta.lfp.user.Dto.UserDto;
import java.time.LocalDateTime;

// api response
public record PostDto (


        Long id ,
        String title,
        String partyCode ,
        int teamSize ,
        int currentPlayers,
        UserDto owner,
        Game game ,
        LocalDateTime CreatedAt,
        Boolean active,
        String playerRank,
        Boolean voiceChat,
        Boolean hasJoined  // null if user not logged in, true if joined, false if not joined
)
{}



