
```markdown
# Cirql Social

Cirql Social is a full-stack social media application with a Node.js backend and a modern frontend. Users can interact, share content, and stay connected in real-time.

---

## Project Structure

```

cirql-social/
│
├── backend/    # Node.js backend
└── frontend/   # Frontend application

````

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm
- PostgreSQL or a compatible database

---

### Backend Setup

1. Navigate to the backend folder:

```bash
cd backend
````

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your database and JWT configuration (example variables shown below, **do not commit secrets**):

```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost

PORT=8000

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

4. Start the backend server:

```bash
npm start
```

The backend runs on `http://localhost:8000` by default.

---

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the frontend:

```bash
npm run dev
```

The frontend runs on the development server (typically `http://localhost:5173`).

---

## Features

* User authentication with JWT
* Real-time notifications
* Social feed for posts, likes, and comments
* Responsive UI

---

## Environment Variables

| Variable               | Description              |
| ---------------------- | ------------------------ |
| `DB_NAME`              | Database name            |
| `DB_USER`              | Database username        |
| `DB_PASSWORD`          | Database password        |
| `DB_HOST`              | Database host            |
| `PORT`                 | Backend server port      |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret  |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |

---

## Notes

* Ensure your database is running before starting the backend.
* Adjust ports if needed to avoid conflicts.

---

## License

MIT License

