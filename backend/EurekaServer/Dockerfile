FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /workspace
COPY EurekaServer/.mvn/ .mvn/
COPY EurekaServer/mvnw EurekaServer/pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -DskipTests dependency:go-offline

COPY EurekaServer/src/ src/
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app
COPY --from=build /workspace/target/EurekaServer-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8761
HEALTHCHECK --interval=10s --timeout=5s --start-period=45s --retries=6 CMD wget -q -O /dev/null http://127.0.0.1:8761/ || exit 1
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
