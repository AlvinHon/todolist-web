package com.ah.todolist.dto.http;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the response body of the delete operation.
 */
public record DeleteResponse(
                /**
                 * The UUID of the deleted item.
                 */
                @Schema(description = "The UUID of the deleted item.") UUID id) {
}
