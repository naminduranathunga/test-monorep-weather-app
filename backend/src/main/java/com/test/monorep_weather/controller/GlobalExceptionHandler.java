package com.test.monorep_weather.controller;

import com.test.monorep_weather.dto.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatusException(
            ResponseStatusException exception,
            WebRequest request) {
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        String path = request instanceof ServletWebRequest servletWebRequest
                ? servletWebRequest.getRequest().getRequestURI()
                : null;

        ApiErrorResponse body = ApiErrorResponse.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(exception.getReason())
                .path(path)
                .build();

        return ResponseEntity.status(status).body(body);
    }
}