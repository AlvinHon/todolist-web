package com.ah.todolist.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.ah.todolist.dto.http.CreateRequest;
import com.ah.todolist.dto.http.CreateResponse;
import com.ah.todolist.dto.http.DeleteRequest;
import com.ah.todolist.dto.http.DeleteResponse;
import com.ah.todolist.dto.http.ExceptionResponse;
import com.ah.todolist.dto.http.ReadRequest;
import com.ah.todolist.dto.http.ReadResponse;
import com.ah.todolist.dto.http.UpdateRequest;
import com.ah.todolist.dto.http.UpdateResponse;
import com.ah.todolist.service.TodoListService;
import com.ah.todolist.util.Converter;
import com.ah.todolist.util.RequestValidator;

import jakarta.servlet.http.HttpServletResponse;

@RestController
public class HTTPController {
    final static int errorHttpStatus = 400;

    @Autowired
    private TodoListService todoListService;

    @GetMapping("/index")
    public String index() {
        return "Todo List API Backend";
    }

    @PostMapping("/create")
    public CreateResponse handleCreateRequest(@RequestBody(required = true) CreateRequest createRequest)
            throws Exception {

        var name = RequestValidator.validateName(createRequest.name());
        var description = createRequest.description();
        var dueDate = RequestValidator.validateDueDate(createRequest.dueDate());

        UUID uuid = todoListService.create(name, description, dueDate);
        return new CreateResponse(uuid);
    }

    @PostMapping("/read")
    public ReadResponse handleReadRequest(@RequestBody(required = true) ReadRequest readRequest) {
        var pagingParams = RequestValidator.validatePaginationParams(readRequest.pagination());
        var page = pagingParams.page();
        var limit = pagingParams.limit();
        var sort = RequestValidator.validateSortParams(readRequest.sort());
        var filter = RequestValidator.validateFilterParams(readRequest.filter());
        var status = filter.map(f -> f.byStatus()).orElse(null);
        var dueDate = filter.map(f -> f.byDueDate()).map(Converter::timestampToDate).orElse(null);

        var items = todoListService.read(status, dueDate, page, limit, sort)
                .stream()
                .map(ReadResponse.ReadTodoItem::from)
                .toList();
        return new ReadResponse(items);
    }

    @PostMapping("/update")
    public UpdateResponse handleUpdateRequest(@RequestBody(required = true) UpdateRequest updateRequest) {
        var uuid = RequestValidator.validateUUID(updateRequest.id());
        var name = RequestValidator.validateName(updateRequest.name());
        var description = updateRequest.description();
        var dueDate = RequestValidator.validateDueDate(updateRequest.dueDate());
        var status = RequestValidator.validateStatus(updateRequest.status());

        todoListService.update(uuid, name, description, dueDate, status);
        return new UpdateResponse(uuid);
    }

    @PostMapping("/delete")
    public DeleteResponse handleDeleteRequest(@RequestBody(required = true) DeleteRequest deleteRequest) {
        var uuid = RequestValidator.validateUUID(deleteRequest.id());

        todoListService.delete(uuid);
        return new DeleteResponse(uuid);
    }

    @ExceptionHandler({ Exception.class })
    public ExceptionResponse handleException(Exception ex, HttpServletResponse response) {
        response.setStatus(errorHttpStatus);
        return new ExceptionResponse(ex.getMessage());
    }

}
