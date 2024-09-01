package com.ah.todolist.stomp;

import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;

/**
 * Handler class that extends StompSessionHandlerAdapter for calling the
 * function "connectAsync" from WebSocketStompClient.
 */
public class AppStompSessionHandler extends StompSessionHandlerAdapter {

}
