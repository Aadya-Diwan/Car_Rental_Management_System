# 🚗 Car Rental Management System

A full-stack web application designed to manage car rentals efficiently. This system allows customers to book cars, calculates rental costs automatically, and maintains proper records using a structured MySQL database.

---

## 📌 Project Overview

The **Car Rental Management System** is a database-driven application that simulates real-world car rental operations. It manages customers, vehicles, bookings, and payments while ensuring data consistency and availability tracking.

---

## 🎯 Features

* 👤 Customer Registration
* 🚗 View Available Cars
* 📅 Book Cars Based on Date Range
* 💰 Automatic Rental Price Calculation
* 💳 Payment Recording
* 🔄 Car Availability Management
* 🧾 Rental Tracking using SQL View
* ✅ Data Integrity using Constraints

---

## 🏗️ Tech Stack

**Frontend:**

* HTML
* CSS
* JavaScript

**Backend:**

* Node.js
* Express.js

**Database:**

* MySQL

---

## 🗂️ Database Design

The system uses a relational database with the following tables:

* **Customers** – Stores customer details
* **Cars** – Stores car details and availability status
* **Rentals** – Stores booking information
* **Payments** – Stores transaction details

### 🔗 Relationships

* One customer → Multiple rentals
* One car → Multiple rentals
* One rental → One payment

---

## ⚙️ How It Works

1. Customer enters personal details
2. System displays available cars
3. User selects a car
4. Rental duration is chosen
5. Total price is calculated automatically
6. Booking is confirmed and stored in database
7. Car status changes from **available → rented**

---

## 🚀 Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Aadya-Diwan/Car_Rental_Management_System.git
cd Car_Rental_Management_System
```

---

### 2️⃣ Setup Database

* Open MySQL
* Run:

```sql
source database.sql;
```

---

### 3️⃣ Start Backend Server

```bash
node server.js
```

Server will run at:

```
http://localhost:5000
```

---

### 4️⃣ Run Frontend

* Open `index.html` in your browser

---

## 📸 Screenshots
<img width="1918" height="1032" alt="image" src="https://github.com/user-attachments/assets/8a0eccba-871a-485b-b6c9-455946a9dd09" />
<img width="1918" height="1082" alt="image" src="https://github.com/user-attachments/assets/07ed3320-47e6-4e5f-a2ac-cb85942223a0" />


## 📊 Key SQL Features Used

* JOIN queries for relational data
* VIEW (`rental_view`) for simplified data access
* CHECK constraints for date validation
* Foreign Keys for referential integrity
* Aggregate logic for pricing

---

## 💡 Sample Use Case

* A customer rents a car for a few days
* System checks availability
* Rental is created
* Charges are calculated
* Car becomes unavailable during rental period

---

## 📸 Future Enhancements

* Admin Dashboard
* Online Payment Integration
* Car Images & Filtering
* User Authentication (Login/Signup)
* React-based frontend

---

## 👩‍💻 Author

**Aadya Diwan**
B.Tech CSE Student

---

## ⭐ Conclusion

This project demonstrates strong understanding of:

* Database design
* Backend API development
* Real-world business logic
* Full-stack integration

---


