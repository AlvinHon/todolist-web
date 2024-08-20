package com.ah.todolist.dto.wsmessage;

import com.ah.todolist.model.TodoItemStatus;

public record UpdateTodoItemActivity(String clientName, String todoItemName, TodoItemStatus todoItemStatus) {
}
