const express = require('express');

const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.param('id', expenseController.checkId);

router
  .route('/')
  .get(expenseController.getAllExpenses)
  .post(expenseController.checkBody, expenseController.createExpense);
router
  .route('/:id')
  .get(expenseController.getExpense)
  .patch(expenseController.updateExpense)
  .delete(expenseController.deleteExpense);

module.exports = router;
