package com.ah.todolist.dto.http;

import java.util.UUID;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the response body of the create operation.
 */
public record CreateResponse(
                /**
                 * The UUID of the created item.
                 */
                @Schema(description = "The UUID of the created item.") UUID id) {
}
