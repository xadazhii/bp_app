FROM maven:3.8.5-openjdk-17 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src

RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre

WORKDIR /app

# Install python and necessary libraries for Excel parsing
RUN apt-get update && apt-get install -y python3 python3-pip && \
    pip3 install pandas openpyxl --break-system-packages && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/target/*.jar app.jar
COPY excel_parser.py .

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
