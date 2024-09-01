package com.ah.todolist.dto.wsmessage;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;

@JsonSerialize
public record DeleteTodoItemActivity(String clientName, String todoItemName) {

}
