# 📝 Blog Backend API

A production-style REST API built with **Node.js**, **Express**, and **PostgreSQL** that demonstrates real-world relational database design.

---

## 🗂 File Structure

```
blog-backend/
├── src/
│   ├── app.js                     # Entry point
│   ├── config/
│   │   └── database.js            # PostgreSQL connection pool
│   ├── db/
│   │   └── init.js                # Creates all tables
│   ├── controllers/
│   │   ├── authController.js      # Register / Login
│   │   ├── postController.js      # CRUD for posts
│   │   ├── commentController.js   # Threaded comments
│   │   └── likeController.js      # Toggle likes
│   ├── middleware/
│   │   └── auth.js                # JWT authentication
│   └── routes/
│       ├── auth.js
│       ├── posts.js
│       ├── comments.js
│       └── likes.js
├── .env.example
├── package.json
└── README.md
```

---

## 🗃 Database Schema

```
users
  id, username, email, password, avatar_url, bio, created_at, updated_at

posts
  id, user_id (FK→users), title, slug, content, excerpt, cover_url,
  published, created_at, updated_at

comments
  id, post_id (FK→posts), user_id (FK→users), parent_id (FK→comments, nullable),
  body, created_at, updated_at

likes
  id, user_id (FK→users), post_id (FK→posts, nullable),
  comment_id (FK→comments, nullable), created_at
  ↳ CHECK: must target exactly one of post_id OR comment_id
  ↳ UNIQUE on (user_id, post_id) and (user_id, comment_id)
```

---

## ⚙️ Setup & Run

### 1. Clone / enter the project

```bash
cd blog-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env and fill in your PostgreSQL credentials and JWT secret
```

### 4. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE blog_db;"
```

### 5. Initialize the tables

```bash
npm run db:init
```

### 6. Start the server

```bash
# Development (hot-reload)
npm run dev

# Production
npm start
```

Server runs on **http://localhost:3000**

---

## 📡 API Endpoints

### Auth
| Method | Endpoint            | Auth | Description       |
|--------|---------------------|------|-------------------|
| POST   | /api/auth/register  | ✗    | Create account    |
| POST   | /api/auth/login     | ✗    | Get JWT token     |
| GET    | /api/auth/me        | ✓    | Current user info |

### Posts
| Method | Endpoint         | Auth | Description              |
|--------|------------------|------|--------------------------|
| GET    | /api/posts       | ✗    | List published posts     |
| GET    | /api/posts/my    | ✓    | Your posts (all)         |
| GET    | /api/posts/:slug | ✗    | Single post              |
| POST   | /api/posts       | ✓    | Create post              |
| PATCH  | /api/posts/:id   | ✓    | Edit post (owner only)   |
| DELETE | /api/posts/:id   | ✓    | Delete post (owner only) |

### Comments
| Method | Endpoint                           | Auth | Description            |
|--------|------------------------------------|------|------------------------|
| GET    | /api/posts/:postId/comments        | ✗    | Get threaded comments  |
| POST   | /api/posts/:postId/comments        | ✓    | Add comment / reply    |
| PATCH  | /api/comments/:id                  | ✓    | Edit comment           |
| DELETE | /api/comments/:id                  | ✓    | Delete comment         |

### Likes
| Method | Endpoint                      | Auth | Description            |
|--------|-------------------------------|------|------------------------|
| POST   | /api/posts/:postId/like       | ✓    | Toggle post like       |
| GET    | /api/posts/:postId/likes      | ✗    | Who liked a post       |
| POST   | /api/comments/:commentId/like | ✓    | Toggle comment like    |

---

## 🔑 Authentication

Pass the JWT token as a Bearer token:

```
Authorization: Bearer <your_token>
```

---

## 💡 Example Requests

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secret123"}'

# Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My First Post","content":"Hello world!","published":true}'

# Add a comment
curl -X POST http://localhost:3000/api/posts/1/comments \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"body":"Great post!"}'

# Like a post
curl -X POST http://localhost:3000/api/posts/1/like \
  -H "Authorization: Bearer <TOKEN>"
```
## 🚀 Tech Stack

Node.js  
Express.js  
PostgreSQL  
JWT Authentication  
REST API

## 📌 Features

##User Authentication (JWT)

Create / Edit / Delete Posts
Threaded Comments
Post Likes
Relational Database Design