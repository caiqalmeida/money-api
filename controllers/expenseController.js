const Expense = require('../models/expenseModel');

exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-value';
  req.query.fields = 'date, category, description, value';
  next();
};

exports.getAllExpenses = async (req, res) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering - Insertirg $ before operators passed in endpoint
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Expense.find(JSON.parse(queryStr));

    // 2) Sorting - you can send alot of sort parameters, one by another, followd by a comma
    // ex : /expenses/?sort=date,value
    // We can inclusively, add a - signal before the parameter, and descend the sorting
    // ex : /expenses/?sort=-date,value

    if (req.query.sort) {
      const sortBy = req.query.sort.replaceAll(',', ' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3) Limiting fields - you can choose all the fields that you want
    // If you add the - signal before the field, you just exclude them to be included

    if (req.query.fields) {
      const fields = req.query.fields.replaceAll(',', ' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numExpenses = await Expense.countDocuments();
      if (skip >= numExpenses) throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    const expenses = await query;

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
