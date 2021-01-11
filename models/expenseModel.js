const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'A expense must have a category'],
      trim: true,
    },
    value: {
      type: Number,
      required: [true, 'A expense must have a value'],
    },
    description: {
      type: String,
      required: [true, 'A expense must have a description'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'A expense must have a date'],
    },
    observation: {
      type: String,
      required: false,
      trim: true,
    },
    instalments: {
      type: Number,
      required: false,
    },
    type: {
      type: String,
      required: [true, 'A expense must have a type'],
      trim: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

expenseSchema.virtual('instalmentValue').get(function () {
  return this.value / this.instalments;
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;
