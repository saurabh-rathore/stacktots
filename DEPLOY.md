# StackTots Deployment Guide for EC2 Ubuntu

This guide provides step-by-step instructions for deploying the StackTots platform on an Amazon EC2 instance running Ubuntu.

## Prerequisites

*   An AWS account with an EC2 instance running Ubuntu.
*   A domain name pointed to the public IP address of your EC2 instance.
*   Docker and Docker Compose installed on your EC2 instance.
*   Node.js and npm installed on your EC2 instance.
*   MySQL installed on your EC2 instance.

## 1. Backend Deployment

### 1.1. Clone the Repository

Clone the repository to your EC2 instance:

```bash
git clone <your-repository-url>
cd stacktots-backend
```

### 1.2. Install Dependencies

Install the backend dependencies:

```bash
npm install
```

### 1.3. Set Up the Database

1.  Log in to your MySQL server:

    ```bash
    mysql -u root -p
    ```

2.  Create a new database for the application:

    ```sql
    CREATE DATABASE stacktots;
    ```

3.  Create a new user and grant privileges to the database:

    ```sql
    CREATE USER 'stacktots'@'localhost' IDENTIFIED BY 'your-password';
    GRANT ALL PRIVILEGES ON stacktots.* TO 'stacktots'@'localhost';
    FLUSH PRIVILEGES;
    ```

4.  Import the database schema:

    ```bash
    mysql -u stacktots -p stacktots < database.sql
    ```

5.  (Optional) Import the sample data:

    ```bash
    mysql -u stacktots -p stacktots < seeds.sql
    ```

### 1.4. Configure Environment Variables

Create a `.env` file in the `stacktots-backend` directory and add the following environment variables:

```
DB_HOST=localhost
DB_USER=stacktots
DB_PASSWORD=your-password
DB_NAME=stacktots
JWT_SECRET=your-jwt-secret
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
EMAIL_HOST=your-email-host
EMAIL_PORT=your-email-port
EMAIL_USER=your-email-user
EMAIL_PASS=your-email-pass
```

### 1.5. Start the Backend Server

You can start the backend server using a process manager like `pm2` to ensure it runs in the background and restarts automatically if it crashes.

```bash
sudo npm install -g pm2
pm2 start index.js --name stacktots-backend
```

## 2. Frontend Deployment

### 2.1. Build the Angular App

1.  Navigate to the `stacktots-frontend` directory:

    ```bash
    cd ../stacktots-frontend
    ```

2.  Install the frontend dependencies:

    ```bash
    npm install
    ```

3.  Build the Angular app for production:

    ```bash
    ng build --prod
    ```

### 2.2. Configure Nginx

1.  Install Nginx:

    ```bash
    sudo apt-get update
    sudo apt-get install nginx
    ```

2.  Create a new Nginx configuration file for the StackTots frontend:

    ```bash
    sudo nano /etc/nginx/sites-available/stacktots
    ```

3.  Add the following configuration to the file, replacing `your-domain.com` with your domain name:

    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        root /path/to/your/stacktots-frontend/dist/stacktots-frontend/browser;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

4.  Enable the new configuration by creating a symbolic link:

    ```bash
    sudo ln -s /etc/nginx/sites-available/stacktots /etc/nginx/sites-enabled/
    ```

5.  Test the Nginx configuration and restart the service:

    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

## 3. Mobile App Deployment

The Flutter mobile app can be built for Android and iOS by following the official Flutter documentation. You will need to replace the `localhost` API URL in the app with the public IP address or domain name of your EC2 instance.

## 4. Load Balancing with Nginx

To handle a high volume of traffic, you can set up a load balancer to distribute requests across multiple instances of the backend server.

1.  Start multiple instances of the backend server on different ports:

    ```bash
    pm2 start index.js --name stacktots-backend-1 -- -p 3001
    pm2 start index.js --name stacktots-backend-2 -- -p 3002
    ```

2.  Update the Nginx configuration to include the upstream servers:

    ```nginx
    upstream backend {
        server localhost:3001;
        server localhost:3002;
    }

    server {
        listen 80;
        server_name your-domain.com;

        root /path/to/your/stacktots-frontend/dist/stacktots-frontend/browser;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  Test the Nginx configuration and restart the service:

    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

## 5. Setting Up HTTPS with Let's Encrypt

It is highly recommended to use HTTPS to encrypt the traffic between the client and the server. You can get a free SSL certificate from Let's Encrypt.

1.  Install Certbot:

    ```bash
    sudo apt-get update
    sudo apt-get install certbot python3-certbot-nginx
    ```

2.  Obtain an SSL certificate:

    ```bash
    sudo certbot --nginx -d your-domain.com
    ```

    Certbot will automatically update your Nginx configuration to use the SSL certificate and set up automatic renewal.

3.  Verify that the renewal process is working:

    ```bash
    sudo certbot renew --dry-run
    ```

## 6. CI/CD with GitHub Actions

You can use GitHub Actions to automate the testing and deployment process.

1.  **Set up secrets:** In your GitHub repository settings, go to "Secrets" and add the following secrets:
    *   `DOCKERHUB_USERNAME`: Your Docker Hub username.
    *   `DOCKERHUB_TOKEN`: Your Docker Hub access token.
    *   `EC2_HOST`: The public IP address of your EC2 instance.
    *   `EC2_USERNAME`: The username for your EC2 instance (e.g., `ubuntu`).
    *   `EC2_KEY`: Your private SSH key for the EC2 instance.

2.  **Create workflow files:** Create the `.github/workflows/backend.yml` and `.github/workflows/frontend.yml` files as described in the previous steps.

3.  **Update the workflow files:** To automatically deploy the new images to your EC2 instance, you can add the following steps to the end of your workflow files:

    ```yaml
    - name: Deploy to EC2
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.EC2_HOST }}
        username: ${{ secrets.EC2_USERNAME }}
        key: ${{ secrets.EC2_KEY }}
        script: |
          docker pull ${{ secrets.DOCKERHUB_USERNAME }}/stacktots-backend:latest
          docker pull ${{ secrets.DOCKERHUB_USERNAME }}/stacktots-frontend:latest
          docker-compose up -d --no-deps backend frontend
    ```

## 7. Logging and Monitoring

### 7.1. Backend Logging

The backend uses Winston for logging. The logs are stored in the following files in the `stacktots-backend` directory:

*   `error.log`: Contains only error logs.
*   `combined.log`: Contains all logs.

You can view the logs using the `tail` command:

```bash
tail -f stacktots-backend/combined.log
```

### 7.2. Frontend Error Tracking

The frontend uses Sentry for error tracking. To set up Sentry, you need to:

1.  Create a new project on [Sentry](https://sentry.io/).
2.  Get your DSN from the project settings.
3.  Replace the placeholder DSN in `stacktots-frontend/src/main.ts` with your actual DSN.

## 8. (Optional) Using Docker

You can also use Docker to containerize the frontend and backend applications.

### 4.1. Build the Docker Images

1.  Navigate to the `stacktots-backend` directory and build the Docker image:

    ```bash
    docker build -t stacktots-backend .
    ```

2.  Navigate to the `stacktots-frontend` directory and build the Docker image:

    ```bash
    docker build -t stacktots-frontend .
    ```

### 4.2. Run the Docker Containers

You can use Docker Compose to run the containers. Create a `docker-compose.yml` file with the following configuration:

```yml
version: '3'
services:
  backend:
    image: stacktots-backend
    ports:
      - "3000:3000"
    env_file:
      - ./stacktots-backend/.env
  frontend:
    image: stacktots-frontend
    ports:
      - "80:80"
```

Then, run the containers:

```bash
docker-compose up -d
```
