package com.ah.todolist.service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.ah.todolist.model.TodoItemStatus;
import com.ah.todolist.model.TodoItem;
import com.ah.todolist.repository.TodoListRepository;

@Service
public class TodoListService {
    @Autowired
    private TodoListRepository todoListRepository;

    public UUID create(String name, String description, Date dueDate) {
        TodoItem item = new TodoItem();
        item.setName(name);
        item.setDescription(description);
        item.setDueDate(dueDate);
        return todoListRepository.save(item).getId();
    }

    public List<TodoItem> read(TodoItemStatus status, Date dueDate, int page, int limit, Sort sort) {
        PageRequest pageRequest = PageRequest.of(page, limit, sort);

        if (status != null && dueDate != null) {
            return todoListRepository.findAllByStatusAndDueDateLessThanEqual(status, dueDate, pageRequest);
        } else if (status != null) {
            return todoListRepository.findAllByStatus(status, pageRequest);
        } else if (dueDate != null) {
            return todoListRepository.findAllByDueDateLessThanEqual(dueDate, pageRequest);
        } else {
            return todoListRepository.findAll(pageRequest);
        }
    }

    public TodoItem update(UUID id, String name, String description, Date dueDate, TodoItemStatus status)
            throws IllegalStateException {
        TodoItem item = todoListRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Item not found"));

        item.setName(name);
        item.setDescription(description);
        item.setDueDate(dueDate);
        item.setStatus(status);

        try {
            return todoListRepository.save(item);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to update item");
        }
    }

    public TodoItem delete(UUID id) throws IllegalStateException {
        TodoItem deleteItem = todoListRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Item not found"));

        try {
            todoListRepository.deleteById(id);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to delete item");
        }

        return deleteItem;
    }

}
