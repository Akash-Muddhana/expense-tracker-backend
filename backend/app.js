const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


const expenseRouter = require("./routes/newExpenseRouter");
const authRouter = require("./routes/authRouter");


const app = express();


const DB_path = process.env.MONGO_URI;
const isProd = process.env.NODE_ENV === "production";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("trust proxy", 1);


app.use(
  cors({
    origin: true,
  })
);






app.use("/api/expense", expenseRouter);
app.use("/api/auth", authRouter);


let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(DB_path);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}


if (!isProd) {
  const PORT = 3001;
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  });
}


module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("🔥 SERVER CRASH:", err);
    res.status(500).json({ error: err.message });
  }
};