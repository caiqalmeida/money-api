const express = require('express');
const morgan = require('morgan');

const expenseRouter = require('./routes/expenseRoutes');
const userRouter = require('./routes/userRoutes');

// Creation of the application
const app = express();

// Middlewares
// Create a req.body object, that is parsed from the request body
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/v1/expenses', expenseRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
