package com.ah.todolist.dto.http;

import com.ah.todolist.model.TodoItemStatus;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * A DTO class that represents the request body of the read operation.
 */
public record ReadRequest(
        /**
         * The pagination parameters that limit the offset and number of the results.
         * If not provided, the default values are used.
         */
        PaginationParams pagination,

        /**
         * The sort parameters that order the results.
         * If not provided, the default values are used.
         */
        SortParams sort,
        /**
         * The filter parameters. This filter is applied to the results before
         * pagination and sorting.
         * if not provided, it means no filter.
         */
        FilterParams filter) {

    public ReadRequest {
        if (pagination == null) {
            pagination = PaginationParams.DEFAULT;
        }

        if (sort == null) {
            sort = SortParams.DEFAULT;
        }
    }

    @Schema(description = "Read results at a offset with limit. If not provided, the default values are used.", defaultValue = "page: 0, limit: 10")
    public record PaginationParams(int page, int limit) {
        public static final PaginationParams DEFAULT = new PaginationParams(0, 10);
    }

    @Schema(description = "Sort the results by value (id, name, description, status, dueDate) in an order ('asc' or 'desc'). If not provided, the default values are used.", defaultValue = "sortBy: id, direction: asc")
    public record SortParams(String sortBy, String direction) {
        public static final SortParams DEFAULT = new SortParams("id", "asc");
    }

    @Schema(description = "Filter the results with due data <= value and/or by status==value. Must specify at least one criteria.")
    public record FilterParams(Long byDueDate, TodoItemStatus byStatus) {

        public boolean hasFilters() {
            return byDueDate != null || byStatus != null;
        }
    }

}
