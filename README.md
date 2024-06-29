# User Authentication API

## Introduction

This is a RESTful API for user authentication, developed as part of an internship demo task for Startup Greece. The API includes functionalities for user registration, login, logout, and protected routes that require authentication.

## Features

- User Registration
- User Login
- Protected Routes
- User Logout

## Technologies Used

- Backend: Node.js, TypeScript.
- ORM: Sequelize-PG
- Authentication: JSON Web Tokens (JWT)
- Password Hashing: bcrypt
- Code quality: SonarQube (no testing provided)

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running
- npm (Node Package Manager)

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/simoneparente/REST-API_StartupGreece.git
    cd REST-API_StartupGreece
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

3. Set up the environment variables: Create a `.env` file in the root directory and add the following: 
```
	DB_URL=postgres://postgres:1234@localhost:5432/postgres
	SECRET_KEY=afjfiwjfowefewk43gregr
```

4. Set up PostgreSQL: - Ensure PostgreSQL is installed and running. - Create a database: ```sh psql -U postgres CREATE DATABASE yourdbname; ``` - Update the `DB_URL` in the `.env` file with your database details.

5.  Start the server:

    ```sh
    npm start
    ```

## API Endpoints

### User Registration

- **URL:** `/api/register`
- **Method:** `POST`
- **Description:** Registers a new user.
- **Request Body:**

```json
{
    "username": "pippo",
    "email": "pluto@gmail.com",
    "password": "paperino"
}
```

- **Responses:**
    - `201 Created` - User registered successfully.
    - `400 Bad Request` - Validation error.
    - `400 Bad Request` - Username already in use
    - `400 Bas Request` - Email already in use

### User Login

- **URL:** `/api/login`
- **Method:** `POST`
- **Description:** Logs in a user.
- **Request Body:**

```json
{
	"email": "pluto@gmail.com",
    "password": "paperino"
}
```

- **Responses:**
    - `200 OK` - User logged in successfully, returns JWT token.
    - `400 Bad Request` - Validation error.
    - `401 Unauthorized` - Invalid credentials.

### Protected Route

- **URL:** `/api/users`
- **Method:** `GET`
- **Description:** Access to protected route.
- **Headers:**
    - `Authorization: Bearer <token>`
- **Responses:**
    - `200 OK` - Access granted.
    - `401 Unauthorized` - No token or invalid token.

### User Logout

- **URL:** `/api/logout`
- **Method:** `POST`
- **Description:** Unauthorize token
- **Headers:**
    - `Authorization: Bearer <token>`
- **Responses:**
    - `200 OK` - Token Unauthorized successfully

## Security Measures

- Passwords are hashed using `bcrypt`.
- JWT tokens are used for session management and securing protected routes.
