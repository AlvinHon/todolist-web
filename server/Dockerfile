FROM maven:3.9-eclipse-temurin-21 as build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

#FROM openjdk:21-jdk-slim
FROM eclipse-temurin:21-jre

# Install MySQL client
RUN apt update && apt upgrade -y && apt install -y default-mysql-client

# Create app directory
COPY --from=build /app/target/todolist-0.0.1-SNAPSHOT.jar todolist-backend.jar
COPY start.sh /start.sh

RUN chmod +x /start.sh

EXPOSE 8080

CMD ["/start.sh"]