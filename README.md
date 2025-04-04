# grepbase

grepbase is a a simple JSON file database with an express backend and a Vue.js frontend. It comes in handy for adding dummy data to test your apps with during development.

## Understanding grepbase

The `backend/data.json` looks like this:

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

### Stores

This is where all your data will live. Data is this file is organize by **stores**. Each store has a key, with a value array containing items (objects) that belongs to the store.

## Defining a store

The data you defined in a store must be strings/texts. Each item added to a store must have an id. Usually the frontend auto creates ids for subsequent items you add.

To define a store:

1. Plan the first item object you want to add. Future items you add to your store will follow this automatically in the frontend as you'll see soon.

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

2. Add it to `backend/data.json`:

```json
{
  "staff": [
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
  ],
}
```

### View your store

1. [Build and run the backend](#running-docker) using Docker.

2. Using your browser or [Postman](https://www.postman.com/), make a GET request to `http://localhost:3000/stores/staff`. The response should be:

```json
[
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
]
```

### Adding data to your store

An easy way to add data to your store is to use the frontend. Store items could be added using an item HTML form or using the JSON editor.

#### Adding data via the HTML form

1. [Build and run the frontend](#running-docker) using Docker.

2. In your browser, navigate to `http://localhost:8080`.

3. Sign up as a new user then login using your credentials.

![Adding item using HTML form](/img/add-item-using-html-form.png)

<!-- TODO: Continue from here -->

## Running Docker

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
