const express = require('express');

const expenseController = require('../controllers/expenseController');

const router = express.Router();

// router.param('id', expenseController.checkId);

router
  .route('/top-5-expenses')
  .get(expenseController.aliasTopExpenses, expenseController.getAllExpenses);

router
  .route('/')
  .get(expenseController.getAllExpenses)
  .post(expenseController.createExpense);
router
  .route('/:id')
  .get(expenseController.getExpense)
  .patch(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;
