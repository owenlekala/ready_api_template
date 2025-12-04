# Production-Ready Node.js Express API Template

A production-ready TypeScript Express API template with JWT authentication, Supabase database, AWS S3 storage, comprehensive error handling, logging, validation, and security features.

## Features

- **TypeScript** - Full type safety and modern JavaScript features
- **JWT Authentication** - Secure token-based authentication
- **Supabase** - PostgreSQL database with type-safe queries
- **AWS S3** - File storage integration
- **Versioned Routes** - `/api/v1/*` structure for easy API versioning
- **Zod Validation** - Request validation with detailed error messages
- **Pino Logging** - Structured JSON logging with request correlation
- **Error Handling** - Centralized error handling with custom error classes
- **Security** - Helmet, CORS, rate limiting, and request size limits
- **Production Ready** - Environment validation, graceful shutdown, health checks

## Project Structure

```
api_template/
├── src/
│   ├── config/          # Configuration files (env, database, AWS, logger)
│   ├── middleware/      # Express middleware (auth, errors, validation, etc.)
│   ├── routes/          # API routes (versioned)
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions (errors, responses)
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env.example         # Environment variables template
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- AWS account with S3 bucket
- JWT secret (minimum 32 characters)

### Installation

1. Clone or copy this template
2. Install dependencies:

```bash
npm install
```

3. Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

4. Update `.env` with your actual values:
   - `JWT_SECRET`: A secure random string (minimum 32 characters)
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `AWS_*`: Your AWS credentials and S3 bucket name

### Database Setup

Create a `users` table in your Supabase database:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Running the Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /api/v1/health` - Detailed health check with uptime

### Users (Protected - Requires JWT)
- `GET /api/v1/users` - Get all users (with pagination)
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

The JWT token should contain at minimum a `userId` field in the payload.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment (development/production/test) | No | development |
| `PORT` | Server port | No | 3000 |
| `JWT_SECRET` | Secret key for JWT signing/verification | Yes | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 7d |
| `SUPABASE_URL` | Supabase project URL | Yes | - |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes | - |
| `AWS_REGION` | AWS region | No | us-east-1 |
| `AWS_ACCESS_KEY_ID` | AWS access key ID | Yes | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | Yes | - |
| `AWS_S3_BUCKET` | S3 bucket name | Yes | - |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | No | info |
| `CORS_ORIGIN` | CORS allowed origins (comma-separated or *) | No | * |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in milliseconds | No | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | No | 100 |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Type check without building

## Error Handling

The API uses a standardized error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "errors": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "requestId": "uuid",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Logging

Logs are structured JSON in production and pretty-printed in development. Each request includes a `requestId` for correlation.

## Security Features

- **Helmet** - Security headers
- **CORS** - Configurable cross-origin resource sharing
- **Rate Limiting** - Configurable request rate limits
- **Request Size Limits** - 10MB maximum request size
- **Input Validation** - All inputs validated with Zod schemas
- **JWT Verification** - Secure token verification

## Contributing

1. Follow the existing code structure
2. Use TypeScript strict mode
3. Add validation for all inputs
4. Include error handling
5. Add logging for important operations
6. Update this README if adding new features

## License

MIT

