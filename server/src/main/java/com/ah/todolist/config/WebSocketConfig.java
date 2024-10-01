package com.ah.todolist.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.ah.todolist.stomp.AppStompClient;

@Configuration
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Value("${spring.stompbroker.url}")
    private String stompBrokerUrl;

    @Bean
    public AppStompClient appStompClient() {
        return new AppStompClient(stompBrokerUrl);
    }
}
