# Grepbase

Grepbase is a a simple JSON file database that runs and exposes its on express and is managed from a Vue.js frontend. It is useful if you are building small hobby projects and need a quick and easy way to setup a database for testing.

## Setup via Docker

### Frontend

```bash
docker build -t grepbase-frontend -f Dockerfile .
```

```bash
docker run -p 8080:80 grepbase-frontend
```

### Backend

```bash
docker build --no-cache -t grepbase-backend .
```

```bash
docker run -p 3000:3000 grepbase-backend
```

