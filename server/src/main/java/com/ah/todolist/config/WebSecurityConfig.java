package com.ah.todolist.config;

import jakarta.servlet.DispatcherType;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(authorize -> {
            authorize.dispatcherTypeMatchers(DispatcherType.ERROR).permitAll();
            authorize.requestMatchers("/index").permitAll();
            authorize.requestMatchers("/read").permitAll();
            authorize.requestMatchers("/user/register").permitAll();
            authorize.requestMatchers("/api-docs").permitAll();
            authorize.requestMatchers("/swagger-ui").permitAll();
            authorize.anyRequest().authenticated();
        })
                .exceptionHandling((customizer) -> {
                    customizer.authenticationEntryPoint((request, response, authException) -> {
                        response.setStatus(HttpStatus.FORBIDDEN.value());
                    });
                })
                .formLogin((formLogin) -> formLogin
                        .loginPage("/user/login")
                        .usernameParameter("username")
                        .passwordParameter("password")
                        .failureHandler((request, response, exception) -> {
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                        })
                        .permitAll())
                .csrf(CsrfConfigurer::disable)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}