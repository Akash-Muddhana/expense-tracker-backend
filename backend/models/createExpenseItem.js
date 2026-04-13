const mongoose = require("mongoose");

const createExpenseSchema = mongoose.Schema({
  title: String,
  amount: {
    type: Number,
    required: true,
  },
  category: String,
  subCategory: String,
  rating: {
    type: Number,
    required: true,
  },
  experience: String,

  userId: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("expenseItem", createExpenseSchema);
