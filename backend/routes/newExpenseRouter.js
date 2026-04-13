const express = require("express");
const expenseRouter = express.Router();
const expenseController = require("../controllers/newExpenseController");
const authController = require("../controllers/authController");


expenseRouter.get(
  "/YourExpenses",
  authController.isAuth,
  expenseController.getExpenseItem
);

expenseRouter.post(
  "/NewExpense",
  authController.isAuth,
  expenseController.postNewExpense
);

expenseRouter.get(
  "/YourExpenses/:id",
  authController.isAuth,
  expenseController.getExpenseById
);

expenseRouter.put(
  "/EditExpenses/:id",
  authController.isAuth,
  expenseController.editExpense
);
expenseRouter.delete(
  "/DeleteExpense/:id",
  authController.isAuth,
  expenseController.deleteExpense
);
module.exports = expenseRouter;