import asyncHandler from 'express-async-handler';
import Task from '../models/taskModel.js';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  const task = await Task.create({
    user: req.user._id,
    title,
    description,
    priority,
    dueDate,
  });

  res.status(201).json(task);
});

// @desc    Get logged in user tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
});

// @desc    Get all tasks (admin only)
// @route   GET /api/tasks/all
// @access  Private/Admin
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({}).populate('user', 'id name');
  res.json(tasks);
});

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    // Check if the user is admin or if the task belongs to the user
    if (req.user.isAdmin || task.user.toString() === req.user._id.toString()) {
      res.json(task);
    } else {
      res.status(401);
      throw new Error('Not authorized');
    }
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  const task = await Task.findById(req.params.id);

  if (task) {
    // Check if the user is admin or if the task belongs to the user
    if (req.user.isAdmin || task.user.toString() === req.user._id.toString()) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(401);
      throw new Error('Not authorized');
    }
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (task) {
    // Check if the user is admin or if the task belongs to the user
    if (req.user.isAdmin || task.user.toString() === req.user._id.toString()) {
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(401);
      throw new Error('Not authorized');
    }
  } else {
    res.status(404);
    throw new Error('Task not found');
  }
});

export {
  createTask,
  getTasks,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};