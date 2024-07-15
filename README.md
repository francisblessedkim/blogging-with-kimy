# Kimy Blogging Tool Project

This project is a blogging tool built with Node.js, Express.js, SQLite, and EJS. It provides a platform for authors to create, edit, and publish articles, and for readers to view and comment on the articles.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [License](#license)

## Features
- User registration and login
- Author home page with published and draft articles
- Settings page for authors to update blog title and author name
- Create, edit, publish, and delete articles
- Reader home page with a list of published articles
- View individual articles with comments
- Like and comment on articles

## Technologies Used
- Node.js
- Express.js
- Passport.js (for authentication)
- SQLite (database)
- EJS (templating engine)
- Bootstrap (for styling)
- bcryptjs (for password hashing)
- connect-flash (for flash messages)
- express-session (for session handling)
- body-parser (for parsing request bodies)

## Installation
1. Install dependencies:
    ```bash
    npm install
    ```

2. Build the database:
    ```bash
    node build-db.js
    ```

## Running the Project
1. Start the server:
    ```bash
    node index.js
    ```

2. Open your web browser and go to `http://localhost:3000`.

## Project Structure
- **config/**: Contains configuration files for authentication and passport.
  - `auth.js`: Middleware to ensure user authentication.
  - `passport.js`: Configuration for Passport.js.
- **public/**: Contains static assets like CSS files.
  - `main.css`: Custom CSS styles.
- **routes/**: Contains route handlers for different parts of the application.
  - `users.js`: Routes for user registration and login.
  - `authors.js`: Routes for author functionalities.
  - `readers.js`: Routes for reader functionalities.
- **views/**: Contains EJS templates for rendering pages.
  - `register.ejs`: User registration page.
  - `login.ejs`: User login page.
  - `author_home.ejs`: Author home page.
  - `author_settings.ejs`: Author settings page.
  - `author_edit_article.ejs`: Edit article page.
  - `reader_home.ejs`: Reader home page.
  - `reader_article.ejs`: View article page.
  - `index.ejs`: Main home page.
  - `layout.ejs`: Layout template.
- `build-db.js`: Script to build the SQLite database.
- `db_schema.sql`: SQL schema for the database.
- `index.js`: Entry point of the application.

## Database Schema
The project uses SQLite for the database. The schema is defined in `db_schema.sql` and includes the following tables:
- **users**: Stores user information (id, name, email, password, created_at).
- **authors**: Stores author information (id, blog_title, name).
- **articles**: Stores article information (id, author_id, title, content, created_at, last_modified, published_at, views, likes).
- **comments**: Stores comments on articles (id, article_id, commenter_name, comment, created_at).


