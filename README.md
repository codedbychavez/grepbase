# grepbase

grepbase is a simple JSON file database with an express backend and a Vue.js frontend. It is handy for adding dummy data to test your apps during development.

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

This is where all your data will live. Data in this file is organized by **stores**. Each store has a key, with a value array containing items (objects) that belong to the store.

#### Defining a store

The data you defined in a store must be strings/texts. Each item added to a store must have an ID. Usually, the frontend auto creates IDs for subsequent items you add.

To define a store:

1. Plan the first item object you want to add. Future items you add to your store will follow this automatically in the front end as you'll see soon.

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

#### View your store

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

#### Adding data to your store

An easy way to add data to your store is to use the front end. Store items could be added using an item HTML form or using the JSON editor.

##### Adding data via the HTML form

1. [Build and run the frontend](#running-docker) using Docker.

2. In your browser, navigate to `http://localhost:8080`.

3. Sign up as a new user then log in using your credentials.

4. In the data viewer, select the store, them click the "Add" button to open the form for adding a new item.

![Adding item using HTML form](/img/add-item-using-html-form.png)

5. After submitting the form, the data will be added to the table.

### Managing Data

In addition to adding new items to your store, the UI is capable of updating and deleting items.
The UI also allows you to create stores, delete stores, and rename stores (accessible on the `/edit` page).

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
