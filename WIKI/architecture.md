# 🏗 Project Architecture

This document outlines the high-level design and data flow of the G-Drive Clone system.

## 🛰 System Overview
The system follows a microservice-inspired architecture where each component is isolated in a Docker container.



---

## 🧩 Key Components

### 1. ⚙️ Core Server (C++)
* **Role:** High-performance data processing and file management.
* **Port:** `5555` (Internal TCP)
* **Description:** This is the engine of the project. It handles the actual byte-shuffling and storage logic. It does not speak HTTP; it communicates with the Node server via raw TCP sockets for maximum speed.

### 2. 🌐 MVC Server (Node.js / Express)
* **Role:** API Gateway and Orchestrator.
* **Port:** `3000` (HTTP)
* **Description:** Acts as the bridge between the frontend and the C++ core. 
    * Authenticates users via **Tokens**.
    * Provides a RESTful API for the frontend.
    * Converts HTTP requests into TCP commands for the C++ server.

### 3. 📱 Mobile App (React Native / Expo)
* **Role:** User Interface.
* **Description:** A cross-platform mobile app that allows users to browse, upload, and view files. It uses a dynamic configuration script to find the MVC server’s IP address regardless of the environment.

### 4. 🗄 Database (MongoDB)
* **Role:** Metadata Storage.
* **Description:** Stores user profiles, file paths, and folder structures. The actual file content is managed by the C++ server, while the "knowledge" of those files lives here.

---

## 🔄 Data Flow: Uploading a File

1. **User Action:** User selects a file in the React Native app.
2. **API Call:** The Mobile app sends a POST request to `http://<HOST_IP>:3000/upload`.
3. **Orchestration:** The Node.js server receives the stream and opens a TCP socket to the C++ server on port `5555`.
4. **Storage:** The C++ server writes the data to the Docker Volume and returns a success code.
5. **Metadata:** Once the C++ server confirms, Node.js saves the file details in MongoDB.
6. **Response:** The user sees "Upload Complete" on their phone.



---


## 🛠 Tech Stack Summary
* **Language:** C++20, JavaScript (ES6+)
* **Frameworks:** Express.js, React Native (Expo)
* **Database:** MongoDB
* **DevOps:** Docker, Docker Compose
