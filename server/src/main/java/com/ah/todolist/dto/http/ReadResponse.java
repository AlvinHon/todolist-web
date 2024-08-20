package com.ah.todolist.dto.http;

import java.util.List;
import java.util.UUID;

import com.ah.todolist.model.TodoItem;
import com.ah.todolist.model.TodoItemStatus;
import com.ah.todolist.util.Converter;

public record ReadResponse(List<ReadTodoItem> items) {

    public record ReadTodoItem(UUID id, String name, String description, Long dueDate, TodoItemStatus status) {

        public static ReadTodoItem from(TodoItem item) {
            return new ReadTodoItem(
                    item.getId(),
                    item.getName(),
                    item.getDescription(),
                    Converter.dateToTimestamp(item.getDueDate()),
                    item.getStatus());
        }
    }
}
