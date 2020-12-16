const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// .connect(process.env.DATABASE_LOCAL, {
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'A expense must have a category'],
  },
  value: {
    type: Number,
    required: [true, 'A expense must have a value'],
  },
  description: {
    type: String,
    required: [true, 'A expense must have a description'],
  },
  date: {
    type: Date,
    required: [true, 'A expense must have a date'],
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

const testExpense = new Expense({
  date: '2020-12-16',
  description: 'Almoço top',
  value: 50,
  category: 'Alimentação',
});

testExpense
  .save()
  .then((doc) => console.log(doc))
  .catch((err) => console.log('Error: ', err));

const port = process.env.PORT || 3000;

app.listen(port, (req, res) => {
  console.log(`MONEY API: Running on port ${port}`);
});
