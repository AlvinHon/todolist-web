package com.ah.todolist.stomp;

import org.springframework.messaging.converter.StringMessageConverter;
import org.springframework.web.socket.client.WebSocketClient;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

import com.fasterxml.jackson.databind.ObjectMapper;

public class AppStompClient {
    private WebSocketClient webSocketClient;
    private WebSocketStompClient stompClient;
    private String brokerUrl;

    public AppStompClient(String brokerUrl) {
        this.webSocketClient = new StandardWebSocketClient();
        this.stompClient = new WebSocketStompClient(webSocketClient);
        this.stompClient.setMessageConverter(new StringMessageConverter());
        this.brokerUrl = brokerUrl;
    }

    public <T> void send(String destination, T message) {
        this.stompClient.connectAsync(brokerUrl, new AppStompSessionHandler())
                .thenAccept(stompSession -> {
                    try {
                        ObjectMapper objectMapper = new ObjectMapper();
                        stompSession.send(destination, objectMapper.writeValueAsString(message));
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });

    }

}
