const expenseItem = require("../models/createExpenseItem");

exports.postNewExpense = async (req, res, next) => {
  try {
    const { title, amount, category, subCategory, rating, experience } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const newItem = new expenseItem({
      title,
      amount,
      category,
      subCategory,
      rating,
      experience,
      date: new Date(),
      userId,
    });

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to create expense", err });
  }
};

exports.getExpenseItem = async (req, res, next) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const expenseitems = await expenseItem.find({ userId });

    res.status(200).json(expenseitems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.editExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const item = await expenseItem.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const { title, amount, category, subCategory, rating, experience } = req.body;

    item.title = title;
    item.amount = amount;
    item.category = category;
    item.subCategory = subCategory;
    item.rating = rating;
    item.experience = experience;

    await item.save();

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

exports.getExpenseById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const item = await expenseItem.findOne({ _id: id, userId });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};
exports.deleteExpense = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const deleted = await expenseItem.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};