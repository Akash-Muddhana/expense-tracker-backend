// Core Module
const path = require("path");
const express = require("express");
const session = require("express-session");
const expenseRouter = require("./routes/newExpenseRouter");
const errorsController = require("./controllers/errors");
const authRouter = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const MongoDbStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const cors = require("cors");
// ❗ IMPORTANT: remove view engine (not needed in API)
// app.set("view engine", "ejs");
// app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ❗ STATIC not needed unless you really serve files
// app.use(express.static(path.join(__dirname, "public")));

// ✅ ENV instead of hardcoded DB
const DB_path = process.env.MONGO_URI;

// ✅ Session store
const store = new MongoDbStore({
  uri: DB_path,
  collection: "sessions",
});
app.set("trust proxy", 1);
// ✅ Session config (fixed for production)
app.use(
  session({
    secret: "sher",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    },
  }),
);

// ❗ REMOVE CORS completely (same domain on Vercel)
// app.use(cors(...));
if (process.env.NODE_ENV !== "production") {
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
  );
}
// ✅ Routes (KEEP SAME)
app.use("/api/expense", expenseRouter);
app.use("/api/auth", authRouter);

// ❗ REMOVE bodyParser (duplicate)
// const bodyParser = require("body-parser");

// ❗ REMOVE app.listen (VERY IMPORTANT)
// const PORT = 3000;

// ✅ DB connection (serverless-safe)
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(DB_path);
    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
}

// ✅ If running locally → start server
if (process.env.NODE_ENV !== "production") {
  const PORT = 3000;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}

// ✅ Export for Vercel
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
