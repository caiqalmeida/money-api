const fs = require('fs');
const express = require('express');

const router = express.Router();

const expenses = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/expenses.json`)
);

const getAllExpenses = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: expenses.length,
    data: {
      expenses,
    },
  });
};

const getExpense = (req, res) => {
  const { id } = req.params;
  const expense = expenses.find((ex) => ex.id === Number(id));

  if (!expense)
    return res.status(404).json({
      message: 'Choose a valid id',
    });

  return res.status(200).json({
    status: 'success',
    data: {
      expense,
    },
  });
};

const createExpense = (req, res) => {
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

const updateExpense = (req, res) => {
  const { id } = req.params;
  const expense = expenses.find((ex) => ex.id === Number(id));

  if (!expense)
    return res.status(404).json({
      message: 'Choose a valid id',
    });

  return res.status(200).json({
    status: 'success',
    data: {
      expense: '<Updated expense here ...>',
    },
  });
};

const deleteExpense = (req, res) => {
  const { id } = req.params;
  const expense = expenses.find((ex) => ex.id === Number(id));

  if (!expense)
    return res.status(404).json({
      message: 'Choose a valid id',
    });

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

router.route('/').get(getAllExpenses).post(createExpense);
router.route('/:id').get(getExpense).patch(updateExpense).delete(deleteExpense);

module.exports = router;
