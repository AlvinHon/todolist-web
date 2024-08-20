package com.ah.todolist.repository;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.ah.todolist.model.TodoItemStatus;
import com.ah.todolist.model.TodoItem;

@Repository
public interface TodoListRepository extends CrudRepository<TodoItem, UUID> {
    List<TodoItem> findAll(Pageable pageable);

    List<TodoItem> findAllByStatus(TodoItemStatus status, Pageable pageable);

    List<TodoItem> findAllByDueDateLessThanEqual(Date dueDate, Pageable pageable);

    List<TodoItem> findAllByStatusAndDueDateLessThanEqual(TodoItemStatus status, Date dueDate, Pageable pageable);
}
