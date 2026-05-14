package com.zanta.lfp.game.controller;


import com.zanta.lfp.game.model.Game;
import com.zanta.lfp.game.service.GameService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/games")
@CrossOrigin(origins = "*")
public class GameController {
    private final GameService gameService;

    @GetMapping("/all")
    public ResponseEntity<?> getGames() {
        return gameService.getAllGames();
    }

    @GetMapping("/{name}")
    public ResponseEntity<?> getGame(@PathVariable  String name) {
        return gameService.getGame(name);
    }

    @DeleteMapping("/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteGame(@PathVariable  String name) {
        return gameService.deleteGame(name);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addGame(@Valid @RequestBody Game game) {
        return gameService.addGame(game);
    }
}


// localhost:8080/api/v1/games/all  [GET]
// localhost:8080/api/v1/games/{name} [GET]
// localhost:8080/api/v1/games/add  [POST]
// localhost:8080/api/v1/games/{name} [DELETE]