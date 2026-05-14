package com.zanta.lfp.game.repository;

import com.zanta.lfp.game.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Integer> {
    Game findByName(String name);
    boolean existsByName(String name);
    void deleteByName(String name);
}
