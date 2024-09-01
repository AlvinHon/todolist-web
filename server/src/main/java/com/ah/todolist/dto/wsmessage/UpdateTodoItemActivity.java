package com.ah.todolist.dto.wsmessage;

import com.ah.todolist.model.TodoItemStatus;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public record UpdateTodoItemActivity(String clientName, String todoItemName, TodoItemStatus todoItemStatus) {
}
