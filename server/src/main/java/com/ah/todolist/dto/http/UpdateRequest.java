package com.ah.todolist.dto.http;

import java.util.UUID;

import com.ah.todolist.model.TodoItemStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the request body of the update operation.
 */
public record UpdateRequest(

                /**
                 * The UUID of the item to be updated.
                 */
                @Schema(description = "The UUID of the item to be updated.", requiredMode = Schema.RequiredMode.REQUIRED) UUID id,

                /**
                 * The name of the item.
                 */
                @Schema(description = "The name of the item.", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 1) String name,
                /**
                 * The description of the item.
                 */
                @Schema(description = "The description of the item.") String description,
                /**
                 * The due date in seconds (Unix Timestamp) for the item. null means no due
                 * date.
                 */
                @Schema(description = "The due date in seconds (Unix Timestamp) for the item. This field absent means no due date.") Long dueDate,
                /**
                 * The status of the item.
                 */
                @Schema(description = "The status of the item.", requiredMode = Schema.RequiredMode.REQUIRED) TodoItemStatus status) {
}
