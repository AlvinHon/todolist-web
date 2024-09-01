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
import com.ah.todolist.service.ActivityFeedsService;
import com.ah.todolist.service.TodoListService;
import com.ah.todolist.util.Converter;
import com.ah.todolist.util.RequestValidator;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletResponse;

@OpenAPIDefinition(info = @Info(title = "Todo List API Backend", description = "Todo list API backend that provides CRUD operations for todo items."))
@RestController
public class HTTPController {
    final static int errorHttpStatus = 400;

    @Autowired
    private TodoListService todoListService;

    @Autowired
    private ActivityFeedsService activityFeedsService;

    // endpoint for testing server readiness.
    @GetMapping("/index")
    public String index() {
        return "Todo List API Backend";
    }

    @Operation(summary = "Create a new todo item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The todo item is created successfully."),
            @ApiResponse(responseCode = "400", description = "Failed to create the todo item.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ExceptionResponse.class))
            })
    })
    @PostMapping("/create")
    public CreateResponse handleCreateRequest(@RequestBody(required = true) CreateRequest createRequest)
            throws Exception {
        var name = RequestValidator.validateName(createRequest.name());
        var description = createRequest.description();
        var dueDate = RequestValidator.validateDueDate(createRequest.dueDate());

        // create a new todo item
        UUID uuid = todoListService.create(name, description, dueDate);

        // send activity feed
        activityFeedsService.sendCreateTodoItemActivity(name);

        return new CreateResponse(uuid);
    }

    @Operation(summary = "Read todo items based on the given criteria")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The todo items are read successfully."),
            @ApiResponse(responseCode = "400", description = "Failed to read the todo items.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ExceptionResponse.class))
            })
    })
    @PostMapping("/read")
    public ReadResponse handleReadRequest(@RequestBody(required = true) ReadRequest readRequest) throws Exception {
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

    @Operation(summary = "Update a todo item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The todo item is updated successfully."),
            @ApiResponse(responseCode = "400", description = "Failed to update the todo item.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ExceptionResponse.class))
            })
    })
    @PostMapping("/update")
    public UpdateResponse handleUpdateRequest(@RequestBody(required = true) UpdateRequest updateRequest)
            throws Exception {
        var uuid = RequestValidator.validateUUID(updateRequest.id());
        var name = RequestValidator.validateName(updateRequest.name());
        var description = updateRequest.description();
        var dueDate = RequestValidator.validateDueDate(updateRequest.dueDate());
        var status = RequestValidator.validateStatus(updateRequest.status());

        todoListService.update(uuid, name, description, dueDate, status);

        // send activity feed
        activityFeedsService.sendUpdateTodoItemActivity(name, status);

        return new UpdateResponse(uuid);
    }

    @Operation(summary = "Delete a todo item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "The todo item is deleted successfully."),
            @ApiResponse(responseCode = "400", description = "Failed to delete the todo item.", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ExceptionResponse.class))
            })
    })
    @PostMapping("/delete")
    public DeleteResponse handleDeleteRequest(@RequestBody(required = true) DeleteRequest deleteRequest)
            throws Exception {
        var uuid = RequestValidator.validateUUID(deleteRequest.id());

        var item = todoListService.delete(uuid);

        // send activity feed
        activityFeedsService.sendDeleteTodoItemActivity(item.getName());

        return new DeleteResponse(uuid);
    }

    @ExceptionHandler({ Exception.class })
    public ExceptionResponse handleException(Exception ex, HttpServletResponse response) {
        response.setStatus(errorHttpStatus);
        return new ExceptionResponse(ex.getMessage());
    }

}
