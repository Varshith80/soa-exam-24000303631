# Solar Panel Inventory — LinkedIn article draft

I built a solar panel inventory application to practice connecting a React
frontend with a Spring Boot REST API and a PostgreSQL database. The application
supports creating, listing, updating, and deleting panel records. Each record
stores its model, manufacturer, wattage, and unit price; the database generates
the record ID.

The frontend is built with React and Vite, styled with Bootstrap and the
project's responsive UI styles, and validates required fields and numeric
values before submitting. The Spring Boot API uses the layered
`com.klef.soa.docker` package structure, validates incoming data, persists
records with Spring Data JPA, and exposes the endpoints in Swagger UI. Eureka
provides service discovery for the backend.

I containerized the frontend and backend separately and added Docker Compose
configuration for PostgreSQL, Eureka, the API, and the web application. Nginx
serves the frontend container and proxies its CRUD requests to the backend over
the Compose network. A GitHub Actions workflow builds and publishes the
frontend and backend images to Docker Hub.

I verified the Compose deployment locally and tested create, list, update, and
delete through the frontend-to-backend route. I also checked validation errors
and confirmed the API's Swagger documentation is available.

## Evidence to add before publishing

- Screenshot: navigation and inventory page
- Screenshot: add/edit form with validation and feedback
- Screenshot: inventory table showing a record
- Screenshot: Swagger UI with API request and response
- Screenshot: successful GitHub Actions workflow run
- Screenshot: both published Docker Hub images
- Screenshot: `docker compose ps` showing running services
- Video: demonstrate the frontend CRUD flow, Swagger request/response, and
  Docker Compose startup

## Project links

- Public repository: <https://github.com/Varshith80/soa-exam-24000303631>
- Docker Hub frontend: <https://hub.docker.com/r/varshith0087/docker-frontend-24000303631>
- Docker Hub backend: <https://hub.docker.com/r/varshith0087/docker-backend-24000303631>
- Instructor to mention: [Jonnalagadda SuryaKiran](https://www.linkedin.com/in/suryakiran1993/)

When publishing, select the instructor's LinkedIn profile from the mention
picker so the name becomes a real LinkedIn tag. Replace this checklist with the
captured evidence and video before posting.
