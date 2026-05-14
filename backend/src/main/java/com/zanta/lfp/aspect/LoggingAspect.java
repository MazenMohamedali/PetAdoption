package com.zanta.lfp.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class LoggingAspect {

    /**
     * Pointcut for all REST controller methods
     * Pattern: com.zanta.lfp.*.controller.*.*(..)
     * Matches all methods in controller packages
     */
    @Pointcut("execution(* com.zanta.lfp.*.controller.*.*(..))")
    public void controllerMethods() {}

    /**
     * @Before - Executes BEFORE any method in controller package
     * Matches all REST controller methods
     */
    @Before("controllerMethods()")
    public void logBefore(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        log.info(" API Call: {}.{}() | Args: {}", className, methodName, args.length > 0 ? args : "none");
    }

    /**
     * @After - Executes AFTER any method in controller package completes (success or failure)
     */
    @After("controllerMethods()")
    public void logAfter(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        
        log.info(" API Completed: {}.{}()", className, methodName);
    }

    /**
     * @AfterReturning - Executes AFTER method returns successfully
     */
    @AfterReturning(pointcut = "controllerMethods()", returning = "result")
    public void logAfterReturning(JoinPoint joinPoint, Object result) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        
        log.info(" API Response: {}.{}() | Success", className, methodName);
    }
}

