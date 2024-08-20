package com.ah.todolist.dto.http;

public record CreateRequest(String name, String description, Long dueDate) {

}
