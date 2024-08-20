package com.ah.todolist.dto.http;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the request body of the create operation.
 */
public record CreateRequest(
                /**
                 * The name of the item to be created.
                 */
                @Schema(description = "The name of the item to be created.") String name,

                /**
                 * The description of the item to be created.
                 */
                @Schema(description = "The description of the item to be created.") String description,

                /**
                 * The due date in seconds (Unix Timestamp) for the item.
                 */
                @Schema(description = "The due date in seconds (Unix Timestamp) for the item.") Long dueDate) {

}
