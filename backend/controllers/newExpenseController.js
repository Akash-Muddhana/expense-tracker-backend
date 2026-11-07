const expenseItem = require("../models/createExpenseItem");

const getOwner = (req) => {
  if (req.user?.userId) return { userId: req.user.userId };

  const guestId = req.get("X-Guest-Id");
  if (
    !guestId ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      guestId,
    )
  ) {
    return null;
  }

  return { guestId };
};

exports.postNewExpense = async (req, res, next) => {
  try {
    const { title, amount, category, subCategory, rating, experience } = req.body;
    const owner = getOwner(req);

    if (!owner) {
      return res.status(400).json({ message: "A valid guest ID is required" });
    }

    const newItem = new expenseItem({
      title,
      amount,
      category,
      subCategory,
      rating,
      experience,
      date: new Date(),
      ...owner,
    });

    const savedItem = await newItem.save();

    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to create expense", err });
  }
};

exports.getExpenseItem = async (req, res, next) => {
  try {
    const owner = getOwner(req);

    if (!owner) {
      return res.status(400).json({ message: "A valid guest ID is required" });
    }

    const expenseitems = await expenseItem.find(owner);

    res.status(200).json(expenseitems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.editExpense = async (req, res, next) => {
  try {
    const id = req.params.id;
    const owner = getOwner(req);

    if (!owner) {
      return res.status(400).json({ message: "A valid guest ID is required" });
    }

    const item = await expenseItem.findOne({ _id: id, ...owner });

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
    const owner = getOwner(req);

    if (!owner) {
      return res.status(400).json({ message: "A valid guest ID is required" });
    }

    const item = await expenseItem.findOne({ _id: id, ...owner });

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
    const owner = getOwner(req);

    if (!owner) {
      return res.status(400).json({ message: "A valid guest ID is required" });
    }

    const deleted = await expenseItem.findOneAndDelete({
      _id: id,
      ...owner,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};