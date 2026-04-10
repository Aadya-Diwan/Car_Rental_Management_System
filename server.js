require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html

// ======================
// DB CONNECTION
// ======================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error("❌ DB Connection Failed:", err);
        return;
    }
    console.log("✅ MySQL Connected");
});

// ======================
// CREATE CUSTOMER
// ======================
app.post("/customers", (req, res) => {
    const { name, email, phone, license_number } = req.body;

    console.log("📥 Incoming:", req.body);

    if (!name || !email || !phone || !license_number) {
        return res.status(400).json({ error: "All fields required ❌" });
    }

    const sql = `
        INSERT INTO Customers (name, email, phone, license_number)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [name, email, phone, license_number], (err, result) => {
        if (err) {
            console.error("❌ DB ERROR:", err);
            return res.status(500).json({ error: "Database error ❌" });
        }

        res.json({
            success: true,
            customer_id: result.insertId
        });
    });
});

// ======================
// GET AVAILABLE CARS
// ======================
app.get("/cars", (req, res) => {
    const sql = "SELECT * FROM Cars WHERE status='available'";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("❌ Cars Fetch Error:", err);
            return res.status(500).send(err);
        }
        res.json(result);
    });
});

// ======================
// BOOK CAR
// ======================
app.post("/rentals", (req, res) => {
    const { customer_id, car_id, start_date, end_date } = req.body;

    console.log("📥 Booking Request:", req.body);

    if (!customer_id || !car_id || !start_date || !end_date) {
        return res.status(400).send("Missing fields ❌");
    }

    const start = new Date(start_date);
    const end = new Date(end_date);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (days <= 0) {
        return res.status(400).send("Invalid dates ❌");
    }

    db.query(
        "SELECT price_per_day FROM Cars WHERE car_id=? AND status='available'",
        [car_id],
        (err, result) => {
            if (err) {
                console.error("❌ Price Fetch Error:", err);
                return res.status(500).send(err);
            }

            if (result.length === 0) {
                return res.send("Car not available ❌");
            }

            const price = result[0].price_per_day;
            const total = price * days;

            db.query(
                `INSERT INTO Rentals 
                (customer_id, car_id, start_date, end_date, total_amount, status)
                VALUES (?, ?, ?, ?, ?, 'ongoing')`,
                [customer_id, car_id, start_date, end_date, total],
                (err, rentalResult) => {

                    if (err) {
                        console.error("❌ Rental Error:", err);
                        return res.status(500).send(err);
                    }

                    const rentalId = rentalResult.insertId;

                    db.query(
                        "UPDATE Cars SET status='rented' WHERE car_id=?",
                        [car_id]
                    );

                    db.query(
                        "INSERT INTO Payments (rental_id, amount, status) VALUES (?, ?, 'paid')",
                        [rentalId, total]
                    );

                    res.send(`Car booked successfully 🚗 Total: ₹${total}`);
                }
            );
        }
    );
});

// ======================
// RETURN CAR
// ======================
app.put("/return/:id", (req, res) => {
    const rentalId = req.params.id;

    db.query(
        "SELECT car_id FROM Rentals WHERE rental_id=?",
        [rentalId],
        (err, result) => {

            if (err) return res.status(500).send(err);
            if (result.length === 0) return res.send("Rental not found ❌");

            const carId = result[0].car_id;

            db.query(
                "UPDATE Rentals SET status='completed' WHERE rental_id=?",
                [rentalId]
            );

            db.query(
                "UPDATE Cars SET status='available' WHERE car_id=?",
                [carId]
            );

            res.send("Car returned successfully ✅");
        }
    );
});

// ======================
// DEFAULT ROUTE
// ======================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// ======================
// SERVER START
// ======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
