package com.zanta.lfp.aspect;

import com.zanta.lfp.user.model.User;
import com.zanta.lfp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Map;

@Aspect
@Component
@Slf4j
@RequiredArgsConstructor
public class SelfDeletionPreventionAspect {

    private final UserRepository userRepository;

    // Pointcut for deleteUser method in UserService
    @Pointcut("execution(* com.zanta.lfp.user.service.UserService.deleteUser(..))")
    public void deleteUserMethod() {}

    @Around("deleteUserMethod()")
    public Object preventSelfDeletion(ProceedingJoinPoint joinPoint) throws Throwable {
        // Get the user ID being deleted (first argument)
        Long userIdToDelete = (Long) joinPoint.getArgs()[0];
        
        // Get currently authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.getPrincipal() != null) {
            Long currentUserId = null;
            
            // Try to get user ID from principal
            if (authentication.getPrincipal() instanceof User) {
                User currentUser = (User) authentication.getPrincipal();
                currentUserId = currentUser.getId();
            } else if (authentication.getPrincipal() instanceof UserDetails) {
                // If principal is UserDetails, get username and find user
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                User currentUser = userRepository.findByUsername(userDetails.getUsername())
                        .orElse(null);
                if (currentUser != null) {
                    currentUserId = currentUser.getId();
                }
            }
            
            // Check if user is trying to delete themselves
            if (currentUserId != null && currentUserId.equals(userIdToDelete)) {
                log.warn(" Self-deletion attempt blocked: User ID {} tried to delete themselves", currentUserId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "the first admin created can't delete him self , we handle it from aop"));
            }
        }
        
        // If not self-deletion, proceed with the method
        return joinPoint.proceed();
    }
}

