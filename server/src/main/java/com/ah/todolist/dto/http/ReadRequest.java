package com.ah.todolist.dto.http;

import com.ah.todolist.model.TodoItemStatus;

public record ReadRequest(
        PaginationParams pagination,
        SortParams sort,
        FilterParams filter) {

    public ReadRequest {
        if (pagination == null) {
            pagination = PaginationParams.DEFAULT;
        }

        if (sort == null) {
            sort = SortParams.DEFAULT;
        }
    }

    public record PaginationParams(int page, int limit) {
        public static final PaginationParams DEFAULT = new PaginationParams(0, 10);
    }

    public record SortParams(String sortBy, String direction) {
        public static final SortParams DEFAULT = new SortParams("id", "asc");
    }

    public record FilterParams(Long byDueDate, TodoItemStatus byStatus) {

        public boolean hasFilters() {
            return byDueDate != null || byStatus != null;
        }
    }

}
