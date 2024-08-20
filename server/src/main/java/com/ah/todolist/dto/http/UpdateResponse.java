package com.ah.todolist.dto.http;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the response body of the update operation.
 */
public record UpdateResponse(
        /**
         * The UUID of the updated item.
         */
        @Schema(description = "The UUID of the updated item.") UUID id) {
}
