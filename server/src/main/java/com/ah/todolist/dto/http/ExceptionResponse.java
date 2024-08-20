package com.ah.todolist.dto.http;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the response body of the exception.
 */
@Schema(description = "The response body of the exception. It is used in exception handling for all handlers.")
public record ExceptionResponse(String error) {
}
