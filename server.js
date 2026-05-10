const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/dashboard", (req, res) => {
    res.render("dashboard");
});

app.get("/bookings", (req, res) => {
    res.render("bookings");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.get("/event/:id", (req, res) => {
    res.render("event-details");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});