package com.ah.todolist.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.ah.todolist.dto.wsmessage.CreateTodoItemActivity;
import com.ah.todolist.dto.wsmessage.DeleteTodoItemActivity;
import com.ah.todolist.dto.wsmessage.UpdateTodoItemActivity;

@Controller
public class WebSocketController {

    @MessageMapping("/create")
    @SendTo("/feeds/create")
    public CreateTodoItemActivity handleCreateRequestActivity(CreateTodoItemActivity activity) throws Exception {
        return activity;
    }

    @MessageMapping("/update")
    @SendTo("/feeds/update")
    public UpdateTodoItemActivity handleUpdateRequestActivity(UpdateTodoItemActivity activity) throws Exception {
        return activity;
    }

    @MessageMapping("/delete")
    @SendTo("/feeds/delete")
    public DeleteTodoItemActivity handleDeleteRequestActivity(DeleteTodoItemActivity activity) throws Exception {
        return activity;
    }

}
