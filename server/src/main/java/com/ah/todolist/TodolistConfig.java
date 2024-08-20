package com.ah.todolist;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class TodolistConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // the client will subscribe to /feeds
        config.enableSimpleBroker("/feeds");
        // client will send messages to /activity/(API) and handled by
        // a websocket controller with API mappings, e.g. (API) = /activity/create
        config.setApplicationDestinationPrefixes("/activity");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // the connection string from client should be like
        // ws://localhost:8080/backend-ws
        registry.addEndpoint("/backend-ws").setAllowedOriginPatterns("*");
    }

}
