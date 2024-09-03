package com.ah.todolist.service;

import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ah.todolist.dto.wsmessage.CreateTodoItemActivity;
import com.ah.todolist.dto.wsmessage.DeleteTodoItemActivity;
import com.ah.todolist.dto.wsmessage.UpdateTodoItemActivity;
import com.ah.todolist.model.TodoItemStatus;
import com.ah.todolist.stomp.AppStompClient;

// TODO implement account system so that the clientName can be used to identify the user
/**
 * Service class for sending activity feeds to the stomp websocket brokers.
 * The send methods must not throw exceptions to prevent data inconsistency
 * within an API handler. i.e. database operations have to be successful before
 * sending the activity feeds.
 */
@Service
public class ActivityFeedsService {
    static final Logger logger = Logger.getLogger(ActivityFeedsService.class.getName());

    @Autowired
    private AppStompClient appStompClient;

    public void sendCreateTodoItemActivity(String clientName, String name) {
        try {
            appStompClient.send("/topic/feeds-create", new CreateTodoItemActivity(clientName, name));
        } catch (Exception e) {
            logger.severe(e.getMessage());
        }
    }

    public void sendUpdateTodoItemActivity(String clientName, String name, TodoItemStatus status) {
        try {
            appStompClient.send("/topic/feeds-update", new UpdateTodoItemActivity(clientName, name, status));
        } catch (Exception e) {
            logger.severe(e.getMessage());
        }
    }

    public void sendDeleteTodoItemActivity(String clientName, String name) {
        try {
            appStompClient.send("/topic/feeds-delete", new DeleteTodoItemActivity(clientName, name));
        } catch (Exception e) {
            logger.severe(e.getMessage());
        }
    }

}
