// Core Modules
const express = require("express");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Routes
const expenseRouter = require("./routes/newExpenseRouter");
const authRouter = require("./routes/authRouter");

// App
const app = express();

// ENV
const DB_path = process.env.MONGO_URI;
const isProd = process.env.NODE_ENV === "production";

// =========================
// Middleware
// =========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ TRUST PROXY (important for Vercel)
app.set("trust proxy", 1);

// =========================
// ✅ CORS (MUST be before session)
// =========================
app.use(
  cors({
    origin: /https:\/\/expense-tracker-.*\.vercel\.app/,
    credentials: true,
  })
);

// =========================
// ✅ Session Store
// =========================
const store = new MongoDbStore({
  uri: DB_path,
  collection: "sessions",
});

// =========================
// ✅ Session Config
// =========================
app.use(
  session({
    secret: "sher",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProd,           // required for HTTPS (Vercel)
      sameSite: isProd ? "none" : "lax", // required for cross-origin
    },
  })
);

// =========================
// Routes
// =========================
app.use("/api/expense", expenseRouter);
app.use("/api/auth", authRouter);

// =========================
// DB Connection (Serverless safe)
// =========================
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(DB_path);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

// =========================
// Local Dev Server
// =========================
if (!isProd) {
  const PORT = 3000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

// =========================
// Vercel Export
// =========================
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("🔥 SERVER CRASH:", err);
    res.status(500).json({ error: err.message });
  }
};