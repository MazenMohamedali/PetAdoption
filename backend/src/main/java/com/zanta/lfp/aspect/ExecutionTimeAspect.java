package com.zanta.lfp.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class ExecutionTimeAspect {

    /**
     * Pointcut for all service methods
     * Pattern: com.zanta.lfp.*.service.*.*(..)
     * Matches all methods in service packages
     */
    @Pointcut("execution(* com.zanta.lfp.*.service.*.*(..))")
    public void serviceMethods() {}

    /**
     * @Before - Executes BEFORE any method in service package
     */
    @Before("serviceMethods()")
    public void beforeServiceMethod(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        log.info(" Before Service: {}.{}()", className, methodName);
    }

    /**
     * @After - Executes AFTER any method in service package completes
     */
    @After("serviceMethods()")
    public void afterServiceMethod(JoinPoint joinPoint) {
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        log.info("After Service: {}.{}()", className, methodName);
    }

    /**
     * @Around - Wraps around any method in service package
     * Measures execution time and logs method details
     */
    @Around("serviceMethods()")
    public Object measureExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        
        String className = joinPoint.getSignature().getDeclaringTypeName();
        String methodName = joinPoint.getSignature().getName();
        
        log.info(" Around - Before proceed: {}.{}()", className, methodName);
        log.info("JoinPoint Kind: {}", joinPoint.getKind());
        log.info("JoinPoint Signature: {}", joinPoint.getSignature());
        log.info("JoinPoint Method Name: {}", joinPoint.getSignature().getName());
        
        try {
            // Execute the actual method
            Object result = joinPoint.proceed();
            
            long executionTime = System.currentTimeMillis() - startTime;
            
            log.info(" Around - After proceed: {}.{}()", className, methodName);
            log.info(" Execution Time: {}.{}() took {} ms", className, methodName, executionTime);
            
            return result;
        } catch (Exception e) {
            long executionTime = System.currentTimeMillis() - startTime;
            log.error(" Error in {}.{}() after {} ms: {}", className, methodName, executionTime, e.getMessage());
            throw e;
        }
    }
}

