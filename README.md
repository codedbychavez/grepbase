# GrepBase

grepbase is a simple JSON file database with an express backend and a Vue.js frontend. It is handy for adding dummy data to test your apps during development.

Here is an example of the database file (`backend/data.json`) with data added:

```json
{
  "mystore": [

 ],
  "My Favorite Songs": [
 {
      "id": 1,
      "title": "Title One",
      "Artist": "Some Artist",
      "Genre": "Electronic",
      "Year": 2013,
      "Duration": "4:07",
      "Album": "Another Album"
 },
 {
      "id": "2",
      "title": "Title Two",
      "Artist": "Other Artist",
      "Genre": "Rock",
      "Year": "2013",
      "Duration": "4:24",
      "Album": "Next Album"
 }
 ]
}
```

Each key represents a **store**. Every store has a value array containing items (objects). Items added to a store via the API/ Frontend UI is auto assigned a unique ID.

## GrepBase API

The API provides user authentication, media upload, and JSON-based key-value storage using local files. Below is a list of available API routes grouped by functionality.

### 🔐 Authentication

`GET /check-session`

Check if a user is currently authenticated.

*Response*:

```json
200 OK: { user }

401 Unauthorized: { error }
```

`POST /sign-in`

Sign in using a username and password.

*Request body*:

```json
{
  "username": "user",
  "password": "pass"
}
```

*Response*:

```json
200 OK: { message, user }

401 Unauthorized: { error }
```

`GET /sign-out`

Sign out the current user.

*Response*:

```json
200 OK: { message }

401 Unauthorized: { error }
```

`POST /sign-up`

Register a new user.

*Request body*:

```json
{
  "username": "user",
  "password": "pass"
}
```

*Response*:

```json
200 OK: { message }

409 Conflict: { error }

500 Internal Server Error: { error }
```

### 🏪 Store Management

`POST /create-store/:storeName`

Create a new store with the specified name.

*Response*:

```json
200 OK: { message }

500 Internal Server Error: { error }
```

`GET /get-stores`

Get the list of all store names.

*Response*:

```json
200 OK: [ "store1", "store2" ]

500 Internal Server Error: { error }
```

`PATCH /rename-store/:oldStoreName/:newStoreName`

Rename an existing store.

*Response*:

```json
200 OK: { message }

500 Internal Server Error: { error }
```

`DELETE /delete-store/:storeName`

Delete a store by name.

*Response*:

```json
200 OK: { message }

500 Internal Server Error: { error }
```

### 📦 Store Item Management

`POST /create-store-item/:storeName`

Add an item to a store.
Request body: JSON object with arbitrary fields. For example:

```json
{
  "id": "1",
  "First Name": "Joe",
  "Last Name": "Fisher",
  "Date of Birth": "10th June 2001",
  "Company": "Acme Inc.",
  "Salary": "75,0000",
  "Date Started": "April 03 2023",
  "Date Ended": "-",
  "Employee Score": "78/100"
}
```

*Response*:

```json
    201 Created: { message }

    404 Not Found: { error }
```

`GET /get-store-items/:storeName`

Get items in a store with a mediaType key.

*Response*:

```json
200 OK: [ item1, item2 ]

404 Not Found: { error }
```

`PATCH /edit-store-item/:storeName`

Edit a store item (by id).
Request body: Full updated item object

*Response*:

```json
201 Created: { message }

404 Not Found: { error }
```

`DELETE /delete-store-item/:storeName/:itemId`

Delete an item from a store by ID.

*Response*:

```json
200 OK: { message }

404 Not Found: { error }
```

### 🎞 Media Management

`POST /upload-media-item/:storeName`

Upload a media file to a store.

Form Data:

- file: File (required)

- mediaType: string (e.g., "image")

*Response*:

```json
201 Created: { message }

400 Bad Request: { error }
```

`GET /get-media-items/:storeName/:mediaType`

Get media items by type from a store.

*Response*:

```json
200 OK: [ mediaItem1, mediaItem2 ]

400 Bad Request: { error }
```

`DELETE /delete-media-item/:storeName/:mediaId`

Delete a media item by ID and remove the file.

*Response*:

```json
    200 OK: { message, deletedMedia }

    404 Not Found: { error }

    500 Internal Server Error: { error }
```

### 🗂 File Hosting

`GET /uploads/:filename`

Static file serving for uploaded media.
Usage:
Access uploaded files at /uploads/filename.ext

### 🛠 Notes

- Express session uses SQLite for persistence.

- Authentication is handled via Passport.js with a local strategy.

- JSON-based store is saved and read using local file I/O.

## Running Locally

### Frontend

```shell
cd frontend

npm run dev
```

### Backend

```shell
cd backend

npm run dev
```

## Running with Docker

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/). This will install docker on your system.

2. Follow the instructions below to build and run the backend and frontend containers:

### Backend

```bash
docker build --no-cache -t grepbase-backend -f Dockerfile.backend .
```

```bash
docker run -d -p 3000:3000 grepbase-backend
```

### Frontend

```bash
docker build --no-cache -t grepbase-frontend -f Dockerfile.frontend .
```

```bash
docker run -d -p 8080:80 grepbase-frontend
```
