package com.ah.todolist.dto.http;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the request body of the delete operation.
 */
public record DeleteRequest(
                /**
                 * The UUID of the item to be deleted.
                 */
                @Schema(requiredMode = Schema.RequiredMode.REQUIRED, description = "The UUID of the item to be deleted.") UUID id) {
}
