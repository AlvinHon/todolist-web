package com.ah.todolist.util;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;

import com.ah.todolist.dto.http.ReadRequest.FilterParams;
import com.ah.todolist.dto.http.ReadRequest.PaginationParams;
import com.ah.todolist.dto.http.ReadRequest.SortParams;
import com.ah.todolist.model.TodoItemStatus;

public class RequestValidator {

    public static String validateUsername(String username) throws IllegalArgumentException {
        return validateStringInput(username,
                "Username is too short");
    }

    public static String validatePassword(String password) throws IllegalArgumentException {
        return validateStringInput(password,
                "Password is too short");
    }

    public static String validateName(String name) throws IllegalArgumentException {
        return validateStringInput(name,
                "Name is too short");
    }

    public static UUID validateUUID(UUID id) throws IllegalArgumentException {
        return validateNonNullInput(id,
                "Invalid id. Must be non-null value.");
    }

    public static TodoItemStatus validateStatus(TodoItemStatus status) throws IllegalArgumentException {
        return validateNonNullInput(status,
                "Invalid status. Must be non-null value.");
    }

    public static Date validateDueDate(Long dueDate) throws IllegalArgumentException {
        // it is fine to have a null due date. It means the task has no due date.
        if (dueDate == null)
            return null;

        Date date = Converter.timestampToDate(dueDate);
        Date now = new Date();
        if (date.before(now)) {
            throw new IllegalArgumentException("Due date is in the past");
        }

        return date;
    }

    public static PaginationParams validatePaginationParams(@NonNull PaginationParams paginationParams)
            throws IllegalArgumentException {
        int page = paginationParams.page();
        int limit = paginationParams.limit();

        if (page < 0) {
            throw new IllegalArgumentException("Invalid page number. Page number must start from 0.");
        }

        if (limit < 1) {
            throw new IllegalArgumentException("Invalid limit. Limit must be greater than 0.");
        }

        return paginationParams;
    }

    public static Sort validateSortParams(@NonNull SortParams sortParams) throws IllegalArgumentException {
        String direction = validateStringInput(sortParams.direction(),
                "Invalid sort direction. Must be non-empty value. Use 'asc' or 'desc'.");
        String sortBy = validateStringInput(sortParams.sortBy(),
                "Invalid sort by field. Must be non-empty value.");
        Sort.Direction sortDirection;
        try {
            sortDirection = Sort.Direction.fromString(direction);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid sort direction. Must be 'asc' or 'desc'.");
        }

        return Sort.by(sortDirection, sortBy);
    }

    public static Optional<FilterParams> validateFilterParams(FilterParams filterParams)
            throws IllegalArgumentException {
        // it is fine to have no filters.
        if (filterParams == null) {
            return Optional.empty();
        }

        // if filters are present, at least one filter must be present.
        if (!filterParams.hasFilters()) {
            throw new IllegalArgumentException("Invalid filter parameters. Must have at least one filter.");
        }

        return Optional.of(filterParams);
    }

    static String validateStringInput(String value, String message) throws IllegalArgumentException {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }

        return value;
    }

    static <T> T validateNonNullInput(T value, String message) throws IllegalArgumentException {
        if (value == null) {
            throw new IllegalArgumentException(message);
        }

        return value;
    }
}
