const Expense = require('../models/expenseModel');
const APIFeatures = require('../utils/apiFeatures');

exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-value';
  req.query.fields = 'date, category, description, value';
  next();
};

exports.getAllExpenses = async (req, res) => {
  try {
    // All the methods chained only work because every method return 'this'
    const features = new APIFeatures(Expense.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const expenses = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: expenses.length,
      data: {
        expenses,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        expense,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const newExpense = await Expense.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        expense: newExpense,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent',
      error: err,
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        expense,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent',
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'invalid data sent',
    });
  }
};

exports.getExpensesStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      {
        $match: { value: { $gte: 0 } },
      },
      {
        $group: {
          _id: { $toUpper: '$category' },
          // _id: '$category',
          numExpenses: { $sum: 1 },
          avgValue: { $avg: '$value' },
          minValue: { $min: '$value' },
          maxValue: { $max: '$value' },
        },
      },
      {
        $sort: { value: 1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'was not possible to get stats',
    });
  }
};
