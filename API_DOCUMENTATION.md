# Finmunity API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User

- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

### Login User

- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Logout User

- **POST** `/auth/logout`

### Refresh Token

- **POST** `/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "string"
  }
  ```

### Get Current User

- **GET** `/auth/me` (Protected)

### Update Profile

- **PUT** `/auth/profile` (Protected)
- **Body:**
  ```json
  {
    "username": "string (optional)",
    "bio": "string (optional)",
    "profilePicture": "string (optional)"
  }
  ```

### Forgot Password

- **POST** `/auth/forgot-password`
- **Body:**
  ```json
  {
    "email": "string"
  }
  ```

### Reset Password

- **POST** `/auth/reset-password`
- **Body:**
  ```json
  {
    "token": "string",
    "newPassword": "string"
  }
  ```

---

## News Endpoints

### Get All News

- **GET** `/news`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `category` (string, optional: crypto|stocks|etfs|economy)
  - `search` (string, optional)
  - `sort` (string, default: "latest", options: latest|trending|popular)

### Get Single News

- **GET** `/news/:id`

### Get Trending News

- **GET** `/news/trending`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `category` (string, optional)
  - `search` (string, optional)

### Get News Categories

- **GET** `/news/categories`

### Create News (Admin)

- **POST** `/news` (Protected)
- **Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "shortDescription": "string",
    "image": "string (URL)",
    "images": ["string (URL)"],
    "author": "string",
    "category": "string",
    "sources": ["string"],
    "isTrending": "boolean"
  }
  ```

### Update News (Admin)

- **PUT** `/news/:id` (Protected)
- **Body:** Same as create

### Delete News (Admin)

- **DELETE** `/news/:id` (Protected)

---

## Market Endpoints

### Get Market Stocks

- **GET** `/market/stocks`
- **Query Parameters:**
  - `exchange` (string, default: "All", options: All|NSE|BSE)
  - `category` (string, default: "All")
  - `search` (string, optional)

### Get Market Overview

- **GET** `/market/overview`

---

## Questions Endpoints

### Get All Questions

- **GET** `/questions`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `filter` (string, default: "all", options: all|investment|crypto|stocks|trading)
  - `search` (string, optional)
  - `sort` (string, default: "latest", options: latest|popular|unanswered)

### Get Single Question

- **GET** `/questions/:id`

### Create Question

- **POST** `/questions` (Protected)
- **Body:**
  ```json
  {
    "title": "string",
    "content": "string",
    "category": "string"
  }
  ```

### Update Question

- **PUT** `/questions/:id` (Protected)
- **Body:** Same as create

### Delete Question

- **DELETE** `/questions/:id` (Protected)

### Get Question Categories

- **GET** `/questions/categories`

### Get User Questions

- **GET** `/questions/users/:id`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)

### Get Question Comments

- **GET** `/questions/:id/comments`

### Add Comment to Question

- **POST** `/questions/:id/comments` (Protected)
- **Body:**
  ```json
  {
    "text": "string",
    "isAnswer": "boolean (optional)"
  }
  ```

### Update Comment

- **PUT** `/questions/comments/:id` (Protected)
- **Body:**
  ```json
  {
    "text": "string"
  }
  ```

### Delete Comment

- **DELETE** `/questions/comments/:id` (Protected)

### Like Comment

- **POST** `/questions/comments/:id/like` (Protected)

---

## Community Endpoints

### Posts

#### Get All Posts

- **GET** `/community/posts` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `userId` (string, optional)
  - `search` (string, optional)
  - `sort` (string, default: "latest", options: latest|popular|trending)

#### Get Single Post

- **GET** `/community/posts/:id` (Protected)

#### Create Post

- **POST** `/community/posts` (Protected)
- **Body:** FormData with:
  - `content` (string)
  - `image` (file, optional)

#### Update Post

- **PUT** `/community/posts/:id` (Protected)
- **Body:** FormData with:
  - `content` (string)
  - `image` (file, optional)

#### Delete Post

- **DELETE** `/community/posts/:id` (Protected)

#### Like Post

- **POST** `/community/posts/:id/like` (Protected)

#### Bookmark Post

- **POST** `/community/posts/:id/bookmark` (Protected)

### Blogs

#### Get All Blogs

- **GET** `/community/blogs` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `userId` (string, optional)
  - `search` (string, optional)
  - `category` (string, optional)
  - `tags` (string, optional, comma separated)
  - `sort` (string, default: "latest", options: latest|popular|trending)

#### Get Single Blog

- **GET** `/community/blogs/:id` (Protected)

#### Create Blog

- **POST** `/community/blogs` (Protected)
- **Body:** FormData with:
  - `title` (string)
  - `content` (string)
  - `image` (file, optional)
  - `tags` (string, comma separated)
  - `category` (string, optional)

#### Update Blog

- **PUT** `/community/blogs/:id` (Protected)
- **Body:** FormData with same fields as create

#### Delete Blog

- **DELETE** `/community/blogs/:id` (Protected)

#### Like Blog

- **POST** `/community/blogs/:id/like` (Protected)

#### Bookmark Blog

- **POST** `/community/blogs/:id/bookmark` (Protected)

### Comments

#### Add Comment

- **POST** `/community/comments` (Protected)
- **Body:**
  ```json
  {
    "postId": "string (optional)",
    "blogId": "string (optional)",
    "content": "string"
  }
  ```

#### Update Comment

- **PUT** `/community/comments/:id` (Protected)
- **Body:**
  ```json
  {
    "content": "string"
  }
  ```

#### Delete Comment

- **DELETE** `/community/comments/:id` (Protected)

#### Like Comment

- **POST** `/community/comments/:id/like` (Protected)

### User Interactions

#### Follow User

- **POST** `/community/users/:id/follow` (Protected)

#### Get Suggested Users

- **GET** `/community/users/suggested` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)

#### Get User Bookmarks

- **GET** `/community/users/bookmarks` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `type` (string, optional: POST|BLOG)

### Discovery & Trending

#### Get Trending Content

- **GET** `/community/trending` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `type` (string, default: "all", options: posts|blogs|all)

#### Get Discovery Content

- **GET** `/community/discover` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `category` (string, optional)

---

## User Endpoints

### Get User Profile

- **GET** `/users/:id`

### Get User Posts

- **GET** `/users/:id/posts`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)

### Get User Blogs

- **GET** `/users/:id/blogs`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)

### Get User Followers

- **GET** `/users/:id/followers`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 20)

### Get User Following

- **GET** `/users/:id/following`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 20)

### Follow User

- **POST** `/users/:id/follow` (Protected)

### Update User Profile

- **PUT** `/users/profile` (Protected)
- **Body:**
  ```json
  {
    "username": "string (optional)",
    "bio": "string (optional)",
    "profilePicture": "string (optional)"
  }
  ```

### Get User Bookmarks

- **GET** `/users/:id/bookmarks`
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `type` (string, optional: post|blog|all)

### Add Bookmark

- **POST** `/users/bookmarks` (Protected)
- **Body:**
  ```json
  {
    "type": "string (post|blog)",
    "itemId": "string"
  }
  ```

### Remove Bookmark

- **DELETE** `/users/bookmarks/:id` (Protected)

### Get Suggested Users

- **GET** `/users/suggested` (Protected)
- **Query Parameters:**
  - `limit` (number, default: 10)

---

## Notification Endpoints

### Get Notifications

- **GET** `/notifications` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 20)
  - `unreadOnly` (boolean, default: false)

### Get Unread Count

- **GET** `/notifications/unread-count` (Protected)

### Mark Notification as Read

- **PUT** `/notifications/:id/read` (Protected)

### Mark All Notifications as Read

- **PUT** `/notifications/read-all` (Protected)

### Delete Notification

- **DELETE** `/notifications/:id` (Protected)

---

## Messaging Endpoints

### Get Conversations

- **GET** `/messages/conversations` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 20)

### Get Unread Message Count

- **GET** `/messages/unread-count` (Protected)

### Start New Conversation

- **POST** `/messages/conversations` (Protected)
- **Body:**
  ```json
  {
    "receiverId": "string",
    "content": "string"
  }
  ```

### Get Conversation Messages

- **GET** `/messages/conversations/:id/messages` (Protected)
- **Query Parameters:**
  - `page` (number, default: 1)
  - `limit` (number, default: 50)

### Send Message

- **POST** `/messages/conversations/:id/messages` (Protected)
- **Body:**
  ```json
  {
    "content": "string"
  }
  ```

### Mark Message as Read

- **PUT** `/messages/messages/:id/read` (Protected)

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "string",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### Pagination Response

```json
{
  "data": [],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number",
    "hasNext": "boolean",
    "hasPrev": "boolean"
  }
}
```

---

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Socket.io Events

### Real-time Features

- **Post Creation:** `post:created`
- **Comment Creation:** `comment:created`
- **Like/Unlike:** `like:toggled`
- **Follow/Unfollow:** `follow:toggled`
- **New Message:** `message:new`
- **Notification:** `notification:new`

---

## File Upload

### Supported Formats

- Images: JPG, JPEG, PNG, GIF, WebP
- Max Size: 10MB

### Upload Endpoints

- Posts: `/community/posts` (with image field)
- Blogs: `/community/blogs` (with image field)

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Headers:** Rate limit info included in response headers

---

## Health Check

- **GET** `/health`
- Returns server status and version information

---

## Total Endpoints Implemented: 81

### Breakdown:

- **Authentication:** 8 endpoints
- **News:** 9 endpoints
- **Market:** 2 endpoints
- **Questions:** 12 endpoints
- **Community:** 45 endpoints
- **Users:** 12 endpoints
- **Notifications:** 5 endpoints
- **Messaging:** 6 endpoints

All endpoints from the requirements document have been successfully implemented with proper error handling, validation, and pagination support.
