# 💰 Expense Tracker - Full Stack Web Application

<p align="center">

A modern, secure and responsive **Expense Tracker** built using **React.js, Spring Boot, Spring Security, JWT Authentication, MySQL, Bootstrap and Chart.js**.

Manage expenses, monitor monthly budgets, generate PDF reports, analyze spending through interactive charts, receive Smart Insights, and securely manage your account — all from one intuitive dashboard.

</p>

<p align="center">

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)

![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens)

![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=for-the-badge&logo=bootstrap)

![Chart.js](https://img.shields.io/badge/Chart.js-Analytics-FF6384?style=for-the-badge&logo=chartdotjs)

![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

</p>

---

# 📌 Table of Contents

- Project Overview
- Features
- Tech Stack
- System Architecture
- Project Structure
- Installation
- Database Configuration
- REST API Endpoints
- Screenshots
- Future Enhancements
- Author
- License

---
# 🚀 Project Overview

Expense Tracker is a modern Full Stack Personal Finance Management System developed using React.js, Spring Boot, Spring Security, JWT Authentication, and MySQL.

The application enables users to securely manage their daily expenses, organize transactions category-wise, monitor monthly budgets, analyze spending patterns using interactive charts, generate PDF reports, and receive Smart Financial Insights through a responsive and user-friendly interface.

The project follows a layered architecture using REST APIs, Spring Security, Hibernate, and MySQL while maintaining a clean separation between the frontend and backend for better scalability and maintainability.
# ✨ Features

## 🔐 Authentication & Security

- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Secure Logout
- Profile Management
- Change Password
- Reset Password

---

## 💸 Expense Management

- Add Expense
- Update Expense
- Delete Expense
- Search Expenses
- Filter by Category
- Filter by Date
- Sort Expenses by Date
- User-wise Expense Management
- Category-wise Expense Tracking

---

## 💰 Budget Management

- Set Monthly Budget
- Update Monthly Budget
- Remaining Budget Tracking
- Budget Status Monitoring

---

## 📊 Dashboard

- Dashboard Summary Cards
- Total Expenses
- Monthly Expenses
- Highest Expense
- Total Transactions

---

## 📈 Analytics

- Interactive Pie Chart
- Category-wise Expense Analysis
- Spending Visualization

---

## 🧠 Smart Insights

- Smart Spending Analysis
- Personalized Financial Insights
- Budget Awareness

---

## 📄 Reports

- Generate PDF Expense Report
- Download PDF Report

---

## 🎨 User Experience

- Dark Mode
- Light Mode
- Fully Responsive Design
- Mobile Friendly
- Tablet Friendly
- Desktop Friendly
- Modern Bootstrap UI
- # 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend** | React.js, JavaScript (ES6), HTML5, CSS3, Bootstrap 5, Axios, Chart.js |
| **Backend** | Java 17, Spring Boot, Spring Security, JWT Authentication, Spring Data JPA, Hibernate, REST APIs |
| **Database** | MySQL |
| **Build Tool** | Maven |
| **Development Tools** | IntelliJ IDEA, VS Code, Git, GitHub, Postman, MySQL Workbench |
# 🏗️ System Architecture

```text
                     ┌──────────────────────┐
                     │      React.js UI     │
                     └──────────┬───────────┘
                                │
                           Axios Requests
                                │
                                ▼
                     ┌──────────────────────┐
                     │   Spring Boot APIs   │
                     └──────────┬───────────┘
                                │
                    Spring Security + JWT
                                │
                                ▼
                     ┌──────────────────────┐
                     │ Spring Data JPA      │
                     │ Hibernate ORM        │
                     └──────────┬───────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │     MySQL Database   │
                     └──────────────────────┘
```
# 📂 Project Structure

```text
expense-tracker-fullstack
│
├── expense-frontend
│   ├── public
│   ├── src
│   ├── package.json
│   └── ...
│
├── expense-backend
│   ├── src
│   │   ├── controller
│   │   ├── entity
│   │   ├── repository
│   │   ├── service
│   │   ├── security
│   │   ├── config
│   │   └── resources
│   │
│   ├── pom.xml
│   └── ...
│
└── README.md
```
# ⚙️ Installation Guide

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/ajju1235/expense-tracker-fullstack.git
```

```bash
cd expense-tracker-fullstack
```

---

## 2️⃣ Backend Setup

```bash
cd expense-backend
```

Configure the MySQL database in:

```properties
src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=your_password
```

Run the backend:

```bash
mvn spring-boot:run
```

Backend will start on:

```
http://localhost:8080
```

---

## 3️⃣ Frontend Setup

```bash
cd expense-frontend
```

Install dependencies

```bash
npm install
```

Run the React application

```bash
npm start
```

Frontend will start on:

```
http://localhost:3000
```
# 🗄️ Database Configuration

Database Used:

- MySQL

Main Tables

- Users
- Expenses
- Budget

ORM

- Spring Data JPA
- Hibernate
- # 🔑 Authentication Flow

```text
User Registration
        │
        ▼
     User Login
        │
        ▼
JWT Token Generated
        │
        ▼
Token Stored
        │
        ▼
Protected REST APIs
        │
        ▼
Expense Operations
```
# 🌐 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate user |
| GET | `/api/expenses` | Get all user expenses |
| POST | `/api/expenses` | Add a new expense |
| PUT | `/api/expenses/{id}` | Update an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |
| GET | `/api/budget` | Get monthly budget |
| POST | `/api/budget` | Set monthly budget |
| PUT | `/api/budget` | Update monthly budget |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |
| PUT | `/api/change-password` | Change password |
| POST | `/api/reset-password` | Reset password |

# 📷 Application Screenshots

> Screenshots will be added here.

| Login | Dashboard |
|-------|-----------|
| *(Coming Soon)* | *(Coming Soon)* |

| Add Expense | Expense List |
|-------------|--------------|
| *(Coming Soon)* | *(Coming Soon)* |

| Budget | Analytics |
|--------|-----------|
| *(Coming Soon)* | *(Coming Soon)* |

| Smart Insights | Profile |
|----------------|---------|
| *(Coming Soon)* | *(Coming Soon)* |

| PDF Report | Reset Password |
|------------|----------------|
| *(Coming Soon)* | *(Coming Soon)* |

# 🚀 Future Enhancements

- Export reports in Excel format
- Email notifications for budget alerts
- Multi-currency support
- Recurring expense management
- Monthly financial reports via email
- Cloud deployment (AWS / Render)

 # 👨‍💻 Author

**Arju Singh Baghel**

🎓 B.Tech in Computer Science Engineering

💼 Java Full Stack Developer

### Connect with Me

- GitHub: https://github.com/ajju1235
- LinkedIn: *(Add your LinkedIn profile link here)*

---

If you like this project, don't forget to ⭐ the repository.

# 📜 License

This project is licensed under the MIT License.

Feel free to use, modify, and improve this project for learning purposes.
