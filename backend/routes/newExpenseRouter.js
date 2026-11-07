const express = require("express");
const expenseRouter = express.Router();
const expenseController = require("../controllers/newExpenseController");
const authController = require("../controllers/authController");


expenseRouter.get(
  "/YourExpenses",
  authController.optionalAuth,
  expenseController.getExpenseItem
);

expenseRouter.post(
  "/NewExpense",
  authController.optionalAuth,
  expenseController.postNewExpense
);

expenseRouter.get(
  "/YourExpenses/:id",
  authController.optionalAuth,
  expenseController.getExpenseById
);

expenseRouter.put(
  "/EditExpenses/:id",
  authController.optionalAuth,
  expenseController.editExpense
);
expenseRouter.delete(
  "/DeleteExpense/:id",
  authController.optionalAuth,
  expenseController.deleteExpense
);
module.exports = expenseRouter;