## Todo List Web (Backend)

Backend server to support CRUD operations on TODO Items.

The server is developed in Java (JDK 21) with maven. It runs HTTP APIs and websocket on port 8080 (configurable by [application.properties](./src/main/resources/application.properties)).

## HTTP APIs

The application supports `OpenAPI` specification with `SwaggerUI`. The associated endpoints are:
- localhost:8080/api-docs
- localhost:8080/swagger-ui/index.html

A snapshot of `OpenAPI` docs can be found in [api-docs](./api-docs.yaml).

## Websocket

The server supports Websocket for forwarding realtime collaboration messages. `STOMP` clients can subscribe and publish messages with the following setting:

- Endpoint: ws://localhost:8000/backend-ws
- Subscribe to Topics: `/feeds/create`, `/feeds/update`, `/feeds/delete`
- Publish to Topics: `/activity/create`, `/activity/update`, `/activity/delete`

In general, the server simply forwards messages from `/activity/xxx` to the topics `/activity/xxx`.

Message format in `/feeds/create` and `/activity/create`:
```json
{
    "clientName": String, 
    "todoItemName": String
}
```

Message format in `/feeds/update` and `/activity/update`:
```json
{
    "clientName": String, 
    "todoItemName": String,
    "todoItemStatus": String
}
```

Message format in `/feeds/delete` and `/activity/delete`:
```json
{
    "clientName": String, 
    "todoItemName": String
}
```

For the usage, please check the frontend document [README.md](../web/README.md)


## Build

```sh
mvn package
```

The built jar file can be found in target folder. E.g. target/todolist-0.0.1-SNAPSHOT.jar.

## Run

```sh
java -jar target/todolist-0.0.1-SNAPSHOT.jar
```