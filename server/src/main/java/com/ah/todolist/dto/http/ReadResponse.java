package com.ah.todolist.dto.http;

import java.util.List;
import java.util.UUID;

import com.ah.todolist.model.TodoItem;
import com.ah.todolist.model.TodoItemStatus;
import com.ah.todolist.util.Converter;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the response body of the read operation.
 */
public record ReadResponse(List<ReadTodoItem> items) {
    /**
     * A DTO class used for the ReadResponse. It is the representation of a
     * TodoItem.
     */
    @Schema(description = "The todo item.")
    public record ReadTodoItem(
            /**
             * The UUID of the item.
             */
            @Schema(description = "The UUID of the item.") UUID id,
            /**
             * The name of the item.
             */
            @Schema(description = "The name of the item.") String name,
            /**
             * The description of the item.
             */
            @Schema(description = "The description of the item.") String description,
            /**
             * The due date in seconds (Unix Timestamp) for the item. null means no due date
             */
            @Schema(description = "The due date in seconds (Unix Timestamp) for the item. This field absent means no due date.") Long dueDate,
            /**
             * The status of the item.
             */
            @Schema(description = "The status of the item.") TodoItemStatus status) {

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
