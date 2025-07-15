# Finmunity Backend API Documentation

A comprehensive financial community backend built with Node.js, Express, Prisma ORM, MongoDB, and Socket.io for real-time features.

## 🚀 Features

- **Authentication & Authorization** with JWT
- **Real-time notifications** with Socket.io
- **File uploads** with Cloudinary and Sharp optimization
- **Community features**: Posts, Blogs, Comments, Likes, Bookmarks
- **User interactions**: Follow/Unfollow, Suggested Users
- **News & Questions** for financial discussions
- **Pagination & Search** for better performance

## 📋 Table of Contents

- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication Routes](#authentication-routes)
  - [News Routes](#news-routes)
  - [Questions Routes](#questions-routes)
  - [Community Routes](#community-routes)
  - [User Routes](#user-routes)
- [Socket.io Events](#socketio-events)
- [Error Handling](#error-handling)
- [File Upload](#file-upload)

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Cloudinary account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Finmunity-core-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Start development server
npm run dev
```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/finmunity"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=5000
FRONTEND_URL="http://localhost:3000"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

## 🔐 Authentication

Most routes require authentication. Include the JWT token in the Authorization header:

```javascript
// Frontend example
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};
```

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api
```

---

## 🔑 Authentication Routes

### 1. Register User

**POST** `/auth/register`

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Account created successfully"
}
```

### 2. Login User

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "url",
    "bio": "User bio"
  }
}
```

### 3. Refresh Token

**POST** `/auth/refresh`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "token": "new_jwt_token"
}
```

### 4. Get Current User

**GET** `/auth/me`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "url",
    "bio": "User bio"
  }
}
```

### 5. Update Profile

**PUT** `/auth/profile`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body (FormData):**

```javascript
const formData = new FormData();
formData.append("bio", "Updated bio");
formData.append("profilePhoto", file); // Optional
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "email": "john@example.com",
    "profilePicture": "new_url",
    "bio": "Updated bio"
  }
}
```

### 6. Forgot Password

**POST** `/auth/forgot-password`

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

### 7. Reset Password

**POST** `/auth/reset-password`

**Request Body:**

```json
{
  "token": "reset_token",
  "password": "new_password"
}
```

---

## 📰 News Routes

### 1. Get All News

**GET** `/news?page=1&limit=10&category=technology&search=bitcoin`

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in title/description

**Response:**

```json
{
  "success": true,
  "news": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Get News by ID

**GET** `/news/:id`

**Response:**

```json
{
  "success": true,
  "news": {
    "id": "news_id",
    "title": "News Title",
    "description": "News description",
    "image": "url",
    "category": "TECHNOLOGY",
    "author": "Author Name",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Get Trending News

**GET** `/news/trending`

**Response:**

```json
{
  "success": true,
  "news": [...]
}
```

### 4. Get News Categories

**GET** `/news/categories`

**Response:**

```json
{
  "success": true,
  "categories": ["TECHNOLOGY", "ECONOMY", "CRYPTO", "STOCKS"]
}
```

### 5. Get Market Stocks

**GET** `/news/market/stocks`

**Response:**

```json
{
  "success": true,
  "stocks": [...]
}
```

### 6. Get Market Overview

**GET** `/news/market/overview`

**Response:**

```json
{
  "success": true,
  "overview": {...}
}
```

---

## ❓ Questions Routes

### 1. Get All Questions

**GET** `/questions?page=1&limit=10&category=investment&search=how`

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category
- `search` (optional): Search in title/content

**Response:**

```json
{
  "success": true,
  "questions": [...],
  "pagination": {...}
}
```

### 2. Get Question by ID

**GET** `/questions/:id`

**Response:**

```json
{
  "success": true,
  "question": {
    "id": "question_id",
    "title": "Question Title",
    "content": "Question content",
    "author": "Author Name",
    "category": "INVESTMENT",
    "likes": 10,
    "comments": [...]
  }
}
```

### 3. Create Question

**POST** `/questions`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "How to invest in stocks?",
  "content": "I'm new to investing and want to learn...",
  "category": "INVESTMENT"
}
```

### 4. Update Question

**PUT** `/questions/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "category": "INVESTMENT"
}
```

### 5. Delete Question

**DELETE** `/questions/:id`

**Headers:**

```
Authorization: Bearer <token>
```

### 6. Get Question Comments

**GET** `/questions/:id/comments`

**Response:**

```json
{
  "success": true,
  "comments": [...]
}
```

### 7. Add Comment to Question

**POST** `/questions/:id/comments`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "text": "This is a helpful comment"
}
```

### 8. Get User Questions

**GET** `/questions/users/:id`

**Response:**

```json
{
  "success": true,
  "questions": [...]
}
```

---

## 👥 Community Routes

### 📝 Posts

#### 1. Create Post

**POST** `/community/posts`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body (FormData):**

```javascript
const formData = new FormData();
formData.append("content", "Post content");
formData.append("image", file); // Optional
```

**Response:**

```json
{
  "success": true,
  "message": "Post created successfully",
  "post": {
    "id": "post_id",
    "content": "Post content",
    "image": "cloudinary_url",
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "profilePicture": "url"
    },
    "likes": [],
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get All Posts

**GET** `/community/posts?page=1&limit=10`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page

**Response:**

```json
{
  "success": true,
  "posts": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalPosts": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### 3. Get Post by ID

**GET** `/community/posts/:id`

**Headers:**

```
Authorization: Bearer <token>
```

#### 4. Update Post

**PUT** `/community/posts/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body (FormData):**

```javascript
const formData = new FormData();
formData.append("content", "Updated content");
formData.append("image", file); // Optional
```

#### 5. Delete Post

**DELETE** `/community/posts/:id`

**Headers:**

```
Authorization: Bearer <token>
```

#### 6. Like/Unlike Post

**POST** `/community/posts/:id/like`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Post liked",
  "liked": true
}
```

#### 7. Bookmark/Unbookmark Post

**POST** `/community/posts/:id/bookmark`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "Post bookmarked",
  "bookmarked": true
}
```

### 📚 Blogs

#### 1. Create Blog

**POST** `/community/blogs`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body (FormData):**

```javascript
const formData = new FormData();
formData.append("title", "Blog Title");
formData.append("content", "Blog content");
formData.append("tags", "investment,stocks,crypto");
formData.append("category", "INVESTMENT");
formData.append("image", file); // Optional
```

**Response:**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "blog": {
    "id": "blog_id",
    "title": "Blog Title",
    "content": "Blog content",
    "image": "cloudinary_url",
    "tags": ["investment", "stocks", "crypto"],
    "category": "INVESTMENT",
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "profilePicture": "url"
    },
    "likes": [],
    "comments": [],
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Get All Blogs

**GET** `/community/blogs?page=1&limit=10&category=investment&search=bitcoin`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `category` (optional): Filter by category
- `search` (optional): Search in title/content

#### 3. Get Blog by ID

**GET** `/community/blogs/:id`

**Headers:**

```
Authorization: Bearer <token>
```

#### 4. Update Blog

**PUT** `/community/blogs/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body (FormData):**

```javascript
const formData = new FormData();
formData.append("title", "Updated title");
formData.append("content", "Updated content");
formData.append("tags", "new,tags");
formData.append("category", "NEW_CATEGORY");
formData.append("image", file); // Optional
```

#### 5. Delete Blog

**DELETE** `/community/blogs/:id`

**Headers:**

```
Authorization: Bearer <token>
```

#### 6. Like/Unlike Blog

**POST** `/community/blogs/:id/like`

**Headers:**

```
Authorization: Bearer <token>
```

#### 7. Bookmark/Unbookmark Blog

**POST** `/community/blogs/:id/bookmark`

**Headers:**

```
Authorization: Bearer <token>
```

### 💬 Comments

#### 1. Add Comment

**POST** `/community/comments`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "Great post!",
  "postId": "post_id" // or "blogId": "blog_id"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "id": "comment_id",
    "content": "Great post!",
    "user": {
      "id": "user_id",
      "username": "john_doe",
      "profilePicture": "url"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 2. Update Comment

**PUT** `/community/comments/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "content": "Updated comment"
}
```

#### 3. Delete Comment

**DELETE** `/community/comments/:id`

**Headers:**

```
Authorization: Bearer <token>
```

#### 4. Like/Unlike Comment

**POST** `/community/comments/:id/like`

**Headers:**

```
Authorization: Bearer <token>
```

### 👤 User Interactions

#### 1. Follow/Unfollow User

**POST** `/community/users/:id/follow`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "message": "User followed",
  "following": true
}
```

#### 2. Get Suggested Users

**GET** `/community/users/suggested?page=1&limit=10`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "users": [
    {
      "id": "user_id",
      "username": "jane_doe",
      "profilePicture": "url",
      "bio": "User bio",
      "_count": {
        "followers": 10,
        "following": 5,
        "posts": 20,
        "blogs": 5
      }
    }
  ],
  "pagination": {...}
}
```

#### 3. Get User Bookmarks

**GET** `/community/users/bookmarks?page=1&limit=10&type=POST`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): 'POST' or 'BLOG'

**Response:**

```json
{
  "success": true,
  "bookmarks": [
    {
      "id": "bookmark_id",
      "type": "POST",
      "post": {
        "id": "post_id",
        "content": "Post content",
        "user": {...},
        "likes": [...],
        "comments": [...]
      }
    }
  ],
  "pagination": {...}
}
```

---

## 👤 User Routes

### 1. Get User Profile

**GET** `/users/:id`

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "username": "john_doe",
    "profilePicture": "url",
    "bio": "User bio",
    "posts": [...],
    "blogs": [...],
    "followers": [...],
    "following": [...],
    "bookmarkPosts": [...],
    "bookmarkBlogs": [...]
  }
}
```

### 2. Get User Posts

**GET** `/users/:id/posts`

**Response:**

```json
{
  "success": true,
  "posts": [...]
}
```

### 3. Get User Blogs

**GET** `/users/:id/blogs`

**Response:**

```json
{
  "success": true,
  "blogs": [...]
}
```

### 4. Get User Followers

**GET** `/users/:id/followers`

**Response:**

```json
{
  "success": true,
  "followers": [...]
}
```

### 5. Get User Following

**GET** `/users/:id/following`

**Response:**

```json
{
  "success": true,
  "following": [...]
}
```

### 6. Get User Bookmarks

**GET** `/users/:id/bookmarks`

**Response:**

```json
{
  "success": true,
  "bookmarks": [...]
}
```

---

## 🔌 Socket.io Events

### Connection

```javascript
// Connect to Socket.io
const socket = io("http://localhost:5000");

// Join with user ID
socket.emit("join", userId);
```

### Listen for Events

#### 1. Notifications

```javascript
socket.on("notification", (notification) => {
  console.log("New notification:", notification);
  // Update UI with notification
});
```

#### 2. New Messages

```javascript
socket.on("newMessage", (message) => {
  console.log("New message:", message);
  // Update chat UI
});
```

#### 3. User Typing

```javascript
socket.on("userTyping", (data) => {
  console.log(`${data.username} is typing...`);
  // Show typing indicator
});
```

#### 4. User Stop Typing

```javascript
socket.on("userStopTyping", (data) => {
  console.log("User stopped typing");
  // Hide typing indicator
});
```

### Emit Events

#### 1. Send Typing Status

```javascript
socket.emit("typing", {
  userId: currentUserId,
  username: currentUsername,
  receiverId: targetUserId,
});
```

#### 2. Stop Typing

```javascript
socket.emit("stopTyping", {
  userId: currentUserId,
  receiverId: targetUserId,
});
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input data
- `INTERNAL_SERVER_ERROR`: Server error

### Frontend Error Handling Example

```javascript
try {
  const response = await fetch("/api/community/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message);
  }

  // Handle success
} catch (error) {
  console.error("Error:", error.message);
  // Show error to user
}
```

---

## 📁 File Upload

### Supported File Types

- Images: JPG, JPEG, PNG, GIF, WebP
- Maximum file size: 5MB

### Image Optimization

- Automatic resizing to 800x800px
- JPEG compression with 80% quality
- Cloudinary cloud storage

### Upload Example

```javascript
// Create FormData
const formData = new FormData();
formData.append("content", "Post with image");
formData.append("image", fileInput.files[0]);

// Upload to server
const response = await fetch("/api/community/posts", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

---

## 🚀 Frontend Integration Examples

### React Example - Create Post

```javascript
import { useState } from "react";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("/api/community/posts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Handle success
        setContent("");
        setImage(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  );
};
```

### React Example - Real-time Notifications

```javascript
import { useEffect, useState } from "react";
import io from "socket.io-client";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Join with user ID
    const userId = localStorage.getItem("userId");
    newSocket.emit("join", userId);

    // Listen for notifications
    newSocket.on("notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => newSocket.close();
  }, []);

  return (
    <div>
      <h3>Notifications</h3>
      {notifications.map((notification, index) => (
        <div key={index}>
          <p>{notification.content}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## 📊 Health Check

### Check Server Status

**GET** `/health`

**Response:**

```json
{
  "status": "OK",
  "message": "Finmunity API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Start production server
npm start

# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# Open Prisma Studio
npm run db:studio
```

### Database Management

```bash
# Reset database
npm run db:reset

# Seed database
npm run db:seed
```

---

## 📝 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Happy coding! 🚀**
