package com.ah.todolist.dto.http;

import java.util.UUID;

import com.ah.todolist.model.TodoItemStatus;

public record UpdateRequest(UUID id, String name, String description, Long dueDate, TodoItemStatus status) {
}
