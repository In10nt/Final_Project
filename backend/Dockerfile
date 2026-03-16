FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Install Maven
RUN apk add --no-cache maven

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src src

# Build application
RUN mvn clean package -DskipTests

# Run application
EXPOSE 8080
CMD ["java", "-Dspring.profiles.active=docker", "-jar", "target/virtual-tryon-platform-1.0.0.jar"]