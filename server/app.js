const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const UserProfile = require("./models/UserProfile");
const { ObjectId } = require("mongodb");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// API Routes (if needed)
app.get("/candidate-token", (req, res) => {
  const secretKey = process.env.JWT_TOKEN_SECRET_KEY;
  const token = jwt.sign(
    { id: "67235b0ee88b4ad24bd8aa08", role: "candidate" },
    secretKey
  );
  res.json({ message: "candidate login token", token: token });
});

app.get("/meeting-link", (req, res) => {
  const token = jwt.sign(
    {
      hrUserId: "6736e65e42e29c82e0ee0735",
      candidateUserId: "67235b0ee88b4ad24bd8aa08",
      jobId: "6679d2cb1e2950a72ee03eba",
      roomId: "ksuhfiw3uefifyh8d8iw3",
    },
    process.env.JWT_TOKEN_SECRET_KEY
  );
  res.json({ message: "meeting-link", token: token });
});

app.get("/admin-token", (req, res) => {
  const secretKey = process.env.JWT_TOKEN_SECRET_KEY;
  const token = jwt.sign(
    { id: "6736e65e42e29c82e0ee0735", role: "admin" },
    secretKey
  );
  res.json({ message: "Admin login token", token: token });
});

app.get("/profile", async (req, res) => {
  try {
    const profile = await UserProfile.find({
      user: new ObjectId("67235b0ee88b4ad24bd8aa08"),
    });
    return res.json(profile[0]);
  } catch (error) {
    console.error(error);
  }
});

module.exports = { app, server };
