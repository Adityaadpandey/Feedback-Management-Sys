# Quick Guide: Build and Run Frontend & Backend with Docker


## **Prerequisites**
- **Docker**
  - Install Docker from [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/).

- **Respository**
    - Clone the repository.
        ```bash
        git clone https://github.com/Adityaadpandey/Feedback-Management-Sys.git
        ```
---


## **Frontend Setup (Bun with Next.js)**

### **Build and Run**
1. **Navigate to Frontend Directory**
   ```bash
   cd frontend
   ```

2. **Build Docker Image**
   ```bash
   docker build -t frontend-app .
   ```

3. **Run Docker Container**
   ```bash
   docker run -d -p 3000:3000 --name frontend-container frontend-app
   ```

4. **Access Application**
   Visit [http://localhost:3000](http://localhost:3000).

---

## **Backend Setup (Node.js with TypeScript)**

### **Build and Run**
1. **Navigate to Backend Directory**
   ```bash
   cd backend/
   ```

2. **Build Docker Image**
   ```bash
   docker build -t backend-app .
   ```

3. **Run Docker Container**
   ```bash
   docker run -d -p 8080:8080 --name backend-container backend-app
   ```

4. **Access Backend**
   Visit [http://localhost:8080](http://localhost:8080).

---

## **Common Commands**
- **Stop Container**
  ```bash
  docker stop <container-name>
  ```

- **Remove Container**
  ```bash
  docker rm <container-name>
  ```

- **View Logs**
  ```bash
  docker logs <container-name>
  ```
