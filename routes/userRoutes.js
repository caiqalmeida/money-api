const express = require('express');

const router = express.Router();

const getAllUsers = (req, res) =>
  res.json({
    message: "This route doesn't exist yet.",
  });

const createUser = (req, res) =>
  res.json({
    message: "This route doesn't exist yet.",
  });

const getUser = (req, res) =>
  res.json({
    message: "This route doesn't exist yet.",
  });

const updateUser = (req, res) =>
  res.json({
    message: "This route doesn't exist yet.",
  });

const deleteUser = (req, res) =>
  res.json({
    message: "This route doesn't exist yet.",
  });

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
