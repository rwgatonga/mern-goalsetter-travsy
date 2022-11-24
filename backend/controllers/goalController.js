const asyncHandler = require('express-async-handler');

const Goal = require('../models/goalModel');
const User = require('../models/UserModel');

// @desc Get goals
// @troute GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find({ user: req.user.id });

  res.status(200).json(goals);
});

// @desc Set goal
// @troute POST /api/goals
// @access Private
const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error('Please add a text field');
  }
  const goal = await Goal.create({
    text: req.body.text,
    user: req.user.id,
  });

  res.status(200).json(goal);
});

// @desc Update goal
// @troute PUT /api/goals/:id
// @access Private

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);

  if (!goal) {
    res.status(400);
    throw new Error('Goal not found');
  }

  const user = await User.findById(req.user.id);

  //check user exists
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // make sure the login user matched the goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorised');
  }

  const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedGoal);
});

// @desc Delete goal
// @troute DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  
  if (!goal) {
    res.status(400);
    throw new Error('Goal not found');
  }

  const user = await User.findById(req.user.id);

  //check user exists
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }

  // make sure the login user matched the goal user
  if (goal.user.toString() !== user.id) {
    res.status(401);
    throw new Error('User not authorised');
  }

  await goal.remove();

  // res.status(200).json(deletedGoal);
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getGoals,
  setGoal,
  updateGoal,
  deleteGoal,
};
