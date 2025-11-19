# Cirql Social

A full-stack social media application built with Node.js and React.

## Prerequisites

- Node.js (v16+)
- npm
- PostgreSQL

## Installation

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432

PORT=8000

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

Start the server:

```bash
npm start
```

Backend runs on `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## Environment Variables

| Variable               | Description              |
| ---------------------- | ------------------------ |
| `DB_NAME`              | PostgreSQL database name |
| `DB_USER`              | Database username        |
| `DB_PASSWORD`          | Database password        |
| `DB_HOST`              | Database host            |
| `DB_PORT`              | Database port            |
| `PORT`                 | Backend server port      |
| `ACCESS_TOKEN_SECRET`  | JWT access token secret  |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |

## License

MIT