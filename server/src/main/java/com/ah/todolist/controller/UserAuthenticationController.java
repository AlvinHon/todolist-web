package com.ah.todolist.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ah.todolist.dto.auth.RegistrationRequest;
import com.ah.todolist.dto.auth.RegistrationResponse;
import com.ah.todolist.dto.http.ExceptionResponse;
import com.ah.todolist.service.AuthUserService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/user")
public class UserAuthenticationController {

    @Autowired
    private AuthUserService authUserService;

    @PostMapping("/register")
    public RegistrationResponse register(@RequestBody RegistrationRequest regRequest) throws Exception {
        var uuid = authUserService.register(regRequest.username(), regRequest.password());
        return new RegistrationResponse(uuid);
    }

    @ExceptionHandler({ Exception.class })
    public ExceptionResponse handleException(Exception ex, HttpServletResponse response) {
        response.setStatus(HttpStatus.BAD_REQUEST.value());
        return new ExceptionResponse(ex.getMessage());
    }
}
