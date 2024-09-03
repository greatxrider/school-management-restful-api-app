# School Database REST API

A REST API for administering a school database with information about users and courses. Users can create new accounts, log in, create new courses, retrieve information on existing courses, and update or delete courses. Authentication is required for making changes to the database.

In a future project, this REST API will be integrated with a front-end client built with React as part of a full-stack JavaScript application.

## Table of Contents
- [School Database REST API](#school-database-rest-api)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Configuration](#database-configuration)
  - [API Endpoints](#api-endpoints)
    - [User Routes](#user-routes)
    - [Course Routes](#course-routes)
  - [Built-In Validation](#built-in-validation)
  - [Password Security](#password-security)
  - [Testing](#testing)
  - [Extra Credit Features](#extra-credit-features)
  - [Technologies Used](#technologies-used)
  - [License](#license)
  - [Contact](#contact)

## Overview

This project creates a REST API using Express to manage a school database. Users can register, log in, and interact with the database to manage courses. Future improvements will involve developing a front-end client using React.

## Features

- User authentication and authorization
- CRUD operations for users and courses
- Input validation for user registration and course management
- Secure password handling with bcrypt
- Sequelize ORM for database management
- Custom middleware for user authentication

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [DB Browser for SQLite](https://sqlitebrowser.org/)
- [Postman](https://www.postman.com/)

## Installation

To set up the project, follow these steps:

1. **Install the dependencies:**

    ```bash
    npm install
    ```

2. **Seed the database:**

    ```bash
    npm run seed
    ```

3. **Start the server:**

    ```bash
    npm start
    ```

4. Visit [http://localhost:5000](http://localhost:5000) to confirm the server is running.

## Database Configuration

1. **Install Sequelize:**

    ```bash
    npm install sequelize
    npm install --save-dev sequelize-cli
    ```

2. **Initialize Sequelize:**

    ```bash
    npx sequelize init
    ```

3. **Update the `config/config.js` file:**

    ```js
    module.exports = {
      development: {
        dialect: "sqlite",
        storage: "fsjstd-restapi.db"
      }
    };
    ```

4. **Test the database connection with Sequelize's authenticate function.**

## API Endpoints

### User Routes
- **GET** `/api/users` - Returns all properties and values for the authenticated user.
- **POST** `/api/users` - Creates a new user, sets the `Location` header to `/`, and returns a `201` HTTP status code.

### Course Routes
- **GET** `/api/courses` - Returns all courses including the associated User object.
- **GET** `/api/courses/:id` - Returns the specified course, including the associated User object.
- **POST** `/api/courses` - Creates a new course.
- **PUT** `/api/courses/:id` - Updates the specified course.
- **DELETE** `/api/courses/:id` - Deletes the specified course.

## Built-In Validation
- **User Registration:** Validates `firstName`, `lastName`, `emailAddress`, and `password`.
- **Course Management:** Validates `title` and `description` for course creation and updates.

## Password Security
User passwords are hashed using `bcrypt` before storage.

## Testing
- Import the `RESTAPI.postman_collection.json` file into Postman to test API endpoints.
- Run tests using the included Postman collection.

## Extra Credit Features
- Ensures email addresses are valid and unique.
- Filters out sensitive or unnecessary fields from the API responses.
- Checks if the authenticated user is the owner of a course before allowing updates or deletions.

## Technologies Used
- **Node.js** - JavaScript runtime environment.
- **Express** - Web framework for Node.js.
- **Sequelize** - ORM for handling the SQLite database.
- **bcrypt.js** - Library for hashing passwords.
- **Postman** - Tool for testing and exploring REST APIs.

## License
This project is licensed under the MIT License - see the `LICENSE` file for details.

## Contact
If you have any questions or need further clarification, feel free to reach out:

- **GitHub:** [@greatxrider](https://github.com/greatxrider)
- **Email:** [daligdigjeph09@gmail.com](mailto:daligdigjeph09@gmail.com)
