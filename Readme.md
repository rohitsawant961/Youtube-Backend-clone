# **YouTube Backend Clone 🎮🚀**

A **full-fledged backend** for a **YouTube clone**, built using **Node.js, Express.js, MongoDB**, and **JWT authentication**. This backend supports **user authentication, video management, playlist operations, and secure token handling**.

---

## **📌 Features**

✅ User authentication (**JWT-based**)\
✅ Refresh token handling\
✅ Playlist management (**CRUD operations**)\
✅ Video upload & retrieval\
✅ Secure API endpoints with authentication\
✅ MongoDB database integration\
✅ Middleware for validation and error handling\
✅ Rate limiting & security with **helmet, cors, and cookie-parser**

---

## **🛠️ Tech Stack**

| Technology                | Purpose                   |
| ------------------------- | ------------------------- |
| **Node.js**               | Server runtime            |
| **Express.js**            | Backend framework         |
| **MongoDB**               | Database                  |
| **Mongoose**              | ORM for MongoDB           |
| **JWT (JSON Web Tokens)** | Authentication            |
| **bcrypt.js**             | Password hashing          |
| **dotenv**                | Environment variables     |
| **cookie-parser**         | Token handling in cookies |
| **cors**                  | Security                  |
| **multer**                | File uploads              |

---

## **📺 Installation**

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/rohitsawant961/Youtube-Backend-clone.git
cd Youtube-Backend-clone
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Set Up Environment Variables**

Create a `.env` file in the project root and add:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
NODE_ENV=development
```

### **4️⃣ Start the Server**

#### **For Development (Hot Reload)**

```sh
npm run dev  # Uses nodemon
```

####

---

## **🔥 API Documentation**

### **📇 Authentication**

#### ✅ Register a New User

```http
POST {{server}}/users/register
```

**Body (Form Data)**

```json
{
  "username": "rohitsawant",
  "email": "r21567@gmail.com",
  "password": "12345",
  "fullName": "Rohit",
  "avatar": "file",
  "coverImage": "file"
}
```

#### ✅ Login User

```http
POST {{server}}/users/login
```

**Body (JSON)**

```json
{
  "username": "rohitsawant",
  "password": "12345"
}
```

#### 💡 **Refresh Access Token**

```http
POST {{server}}/users/refresh-token
```

#### 🚪 **Logout**

```http
POST {{server}}/users/logout
```

### **🎥 Playlist Management**

#### 📌 **Get Playlist by ID**

```http
GET {{server}}/playlists/:playlistId
```

#### ➕ **Add Video to Playlist**

```http
POST {{server}}/playlists/:playlistId/videos/:videoId
```

### **🎧 Videos**

#### 🎥 **Get All Videos**

```http
GET {{server}}/videos/getAllVideos
```

#### 💄 **Upload a Video**

```http
POST {{server}}/videos/upload_video
```

*(Requires authentication and file upload)*

---

## **🛡 Security Features**

✅ **JWT Authentication** (Access & Refresh Tokens)\
✅ **Bcrypt Password Hashing**\
✅ **CORS Protection**\
✅ **Rate Limiting (Prevents Brute-Force Attacks)**

---

## **🌟 License**

This project is open-source under the **MIT License**.

---

## **👤 Contact**

👤 **Rohit Sawant**\
👉 [GitHub](https://github.com/rohitsawant961)

---

### **🚀 Happy Coding!** 🎉

