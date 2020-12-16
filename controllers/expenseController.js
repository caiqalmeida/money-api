const fs = require('fs');

const expenses = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/expenses.json`)
);

exports.checkId = (req, res, next, value) => {
  const id = value;
  const expense = expenses.find((ex) => ex.id === Number(id));

  if (!expense)
    return res.status(404).json({
      message: 'Choose a valid id',
    });

  next();
};

exports.checkBody = (req, res, next) => {
  const { date, value, category, description } = req.body;

  if (!date || !value || !category || !description) {
    return res.status(404).json({
      status: 'fail',
      message:
        'The fields : date, value, category and description are obrigatory',
    });
  }

  next();
};

exports.getAllExpenses = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: expenses.length,
    data: {
      expenses,
    },
  });
};

exports.getExpense = (req, res) => {
  const { id } = req.params;
  const expense = expenses.find((ex) => ex.id === Number(id));

  res.status(200).json({
    status: 'success',
    data: {
      expense,
    },
  });
};

exports.createExpense = (req, res) => {
  const newId = expenses[expenses.length - 1].id + 1;
  const newExpense = { id: newId, ...req.body };

  expenses.push(newExpense);
  fs.writeFile(
    `${__dirname}/../dev-data/data/expenses.json`,
    JSON.stringify(expenses),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          expense: newExpense,
        },
      });
    }
  );
};

exports.updateExpense = (req, res) =>
  res.status(200).json({
    status: 'success',
    data: {
      expense: '<Updated expense here ...>',
    },
  });

exports.deleteExpense = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
