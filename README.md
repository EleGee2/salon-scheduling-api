# Salon Scheduling API

## 📝 Description

A robust NestJS API for managing salon services, staff, availability, and appointments. Designed to be performant, extensible, and production-ready — with support for webhooks, caching, role-based access, and timezone-aware scheduling.

## ✨ Features

- ✅ **Service Management**: Full CRUD operations for salon services
- ✅ **Staff Management**: Staff profiles with timezone support and working hours
- ✅ **Service-Staff Assignment**: Link staff members to specific services
- ✅ **Availability Calculation**: Real-time availability slots with timezone support
- ✅ **Appointment Booking**: Conflict-free appointment scheduling
- ✅ **Webhook Notifications**: Real-time notifications for new bookings
- ✅ **Role-based Access**: API key authentication for protected endpoints
- ✅ **Request Logging**: Comprehensive logging with Pino
- ✅ **Response Formatting**: Standardized API responses with pagination
- ✅ **Caching**: Caching for availability queries
- ✅ **OpenAPI Documentation**: Interactive Swagger documentation
- ✅ **GraphQL Support**: Apollo Server with auto-generated schema
- ✅ **Database Migrations**: TypeORM migrations for schema management
- ✅ **Unit/Integration Tests**: Comprehensive test coverage with Jest
- ✅ **Docker Support**: Containerized development and deployment

## 📚 Table of Contents

* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Usage](#usage)
    * [Running the App for Development](#running-the-app-for-development)
    * [Running Database Migrations](#running-database-migrations)
    * [API Endpoints](#api-endpoints)
    * [GraphQL](#graphql)
* [Environment Variables](#-environment-variables)
* [API Documentation](#-api-documentation)
* [Testing](#-testing)
* [Database Schema](#-database-schema)
* [Deployment](#-deployment)
* [Built With](#-built-with)
* [Contributing](#-contributing)
* [License](#-license)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have the following software installed on your machine:

* [Docker](https://www.docker.com/products/docker-desktop/) (v20.10+)
* [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)
* [Node.js](https://nodejs.org/) (v18+ for local development)
* [Yarn](https://yarnpkg.com/getting-started/install) (v1.22+)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/EleGee2/salon-scheduling-api.git
    cd salon-scheduling-api
    ```

2.  **Create the environment file**
    Copy the example environment file to create your own local configuration.
    ```bash
    cp env.sample .env
    ```
    Now, open the `.env` file and fill in the required values. See the [Environment Variables](#-environment-variables) section for more details.

3.  **Install local dependencies** (optional)
    While the application runs in Docker, you may need dependencies installed locally for your IDE or local tooling.
    ```bash
    yarn install
    ```

## 💻 Usage

### Running the App for Development

The entire development environment is managed by Docker Compose.

1.  **Build and start the services**
    This command will build the Docker images and start the application and database containers in the background.
    ```bash
    docker-compose up --build -d
    ```

2.  **View container logs**
    To see the logs from the running application container:
    ```bash
    docker-compose logs -f app
    ```

The application will be running and accessible at `http://localhost:3000`. The service supports hot-reloading, so any changes you make to the source code will automatically restart the server.

### Running Database Migrations

Database migrations are managed using TypeORM. They must be run from within the running `app` container.

* **To apply all existing migrations to the database:**
    ```bash
    docker-compose exec app yarn run migration:run
    ```

* **To generate a new migration:**
    ```bash
    docker-compose exec app yarn run migration:generate -- -n MigrationName
    ```

* **To revert the last migration:**
    ```bash
    docker-compose exec app yarn run migration:revert
    ```

### Stopping the Application

To stop all running containers:
```bash
docker-compose down
```

To stop and remove all data (including database):
```bash
docker-compose down -v
```

## 🔌 API Endpoints

### Services (`/services`)
- `POST /services` - Create a new service
- `GET /services` - List all services (with pagination)
- `PATCH /services/:id` - Update a service
- `POST /services/:id/staff` - Assign staff to a service
- `GET /services/:id/staff` - Get staff assigned to a service
- `GET /services/:id/availability` - Get availability for a service

### Staff (`/staff`)
- `POST /staff` - Create a new staff member
- `GET /staff` - List all staff (with pagination)

### Appointments (`/appointments`)
- `POST /appointments` - Create a new appointment

### Webhooks (`/webhooks`)
- `POST /webhooks` - Webhook endpoint for external integrations

### Health Check
- `GET /` - Health check endpoint

## 🎯 GraphQL

The API also supports GraphQL queries through Apollo Server. The GraphQL playground is available at `http://localhost:3000/graphql`.

### Available Queries

```graphql
# Health check
query {
  healthCheck
}

# Get availability for a service
query GetAvailability($serviceId: Int!, $date: String!) {
  availability(serviceId: $serviceId, date: $date) {
    staffId
    staffName
    availableSlots
  }
}
```

### Example GraphQL Query

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { healthCheck }"
  }'
```

## 🔧 Environment Variables

Create a `.env` file based on `env.sample` with the following variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Application port | No | `3000` |
| `NODE_ENV` | Node environment | No | `development` |
| `APP_ENV` | Application environment | Yes | - |
| `LOGGING_LEVEL` | Logging level | No | `info` |
| `DATABASE_URL` | PostgreSQL connection URL | Yes | - |
| `POSTGRES_USER` | Database username | Yes | - |
| `POSTGRES_PASSWORD` | Database password | Yes | - |
| `POSTGRES_DB` | Database name | Yes | - |
| `API_KEY` | API key for authentication | Yes | - |
| `CACHE_TTL` | Cache TTL in seconds | No | `5` |
| `WEBHOOK_URL` | Webhook endpoint URL | No | - |
| `WEBHOOK_SECRET` | Webhook secret for verification | No | - |

### Example `.env` file:
```env
PORT=3000
NODE_ENV=development
APP_ENV=development
LOGGING_LEVEL=debug
DATABASE_URL=postgresql://postgres:password@db:5432/salon_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=salon_db
API_KEY=your-secret-api-key
CACHE_TTL=300
WEBHOOK_URL=https://your-webhook-endpoint.com/webhook
WEBHOOK_SECRET=your-webhook-secret
```

## 📖 API Documentation

The API documentation is automatically generated using Swagger and is available when the application is running or can be accessed here https://documenter.getpostman.com/view/29390219/2sB34fohMV.

Navigate to http://localhost:3000/docs to view the interactive Swagger UI.

### Authentication

Most endpoints require API key authentication. Include your API key in the request headers:

```bash
curl -H "X-API-Key: your-secret-api-key" \
     http://localhost:3000/services
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
docker-compose exec app yarn test

# Run tests in watch mode
docker-compose exec app yarn test:watch
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following main entities:

### Services
- `id` (Primary Key)
- `name` (Service name)
- `duration` (Duration in minutes)
- `price` (Service price)
- `buffer_time` (Buffer time in minutes)
- `created_at`, `updated_at`, `deleted_at` (Timestamps)

### Staff
- `id` (Primary Key)
- `name` (Staff name)
- `timezone` (Staff timezone)
- `created_at`, `updated_at`, `deleted_at` (Timestamps)

### Working Hours
- `id` (Primary Key)
- `dayOfWeek` (0-6, Sunday-Saturday)
- `startTime` (Start time)
- `endTime` (End time)
- `staffId` (Foreign Key to Staff)

### Appointments
- `id` (Primary Key)
- `staffId` (Foreign Key to Staff)
- `serviceId` (Foreign Key to Service)
- `startTime` (Appointment start time with timezone)
- `endTime` (Appointment end time with timezone)
- `created_at`, `updated_at`, `deleted_at` (Timestamps)


## 🛠️ Built With

* [NestJS](https://nestjs.com/) - Progressive Node.js framework
* [TypeORM](https://typeorm.io/) - Object-Relational Mapping
* [PostgreSQL](https://www.postgresql.org/) - Database
* [GraphQL](https://graphql.org/) - Query language for APIs
* [Apollo Server](https://www.apollographql.com/docs/apollo-server/) - GraphQL server
* [Swagger](https://swagger.io/) - API documentation
* [Jest](https://jestjs.io/) - Testing framework
* [Docker](https://www.docker.com/) - Containerization
* [Redis](https://redis.io/) - Caching
* [Pino](https://getpino.io/) - Logging
