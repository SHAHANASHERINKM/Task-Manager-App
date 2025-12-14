const db = require('../models/database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    home: (req, res) => {
        res.send('Welcome to the Task Manager App!');
    },

    signup: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
            }

            const existingUser = await db.User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already registered' });
            }

            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

            if (!passwordRegex.test(password)) {
                return res.status(400).json({
                    success: false,
                    message:
                        'Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            const user = await db.User.create({ name, email, passwordHash });


            res.status(201).json({
                success: true,
                message: 'User registered successfully',
              
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    },

login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await db.User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  createTask :async (req, res) => {
  try {
    const { title, description, status, dueDate, priority } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const task = await db.Task.create({
      title,
      description,
      status: status || "Pending",
      dueDate,
      priority: priority || "Low",
      user: req.userId
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
},
 getTasks :async (req, res) => {
  try {
    

    const tasks = await db.Task.find({ user: req.userId }).sort({ createdAt: -1 });

  
    res.status(200).json({
      success: true,
      message: "All tasks fetched successfully",
      tasks
    });
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
},

 getTasksByStatus : async (req, res) => {
  try {
    // Get status from query (?status=pending or ?status=completed)
    const status = req.query.status;

    if (!status || (status !== "Pending" && status !== "Completed")) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid status: 'pending' or 'completed'" 
      });
    }

    const tasks = await db.Task.find({ user: req.userId, status }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `All ${status} tasks fetched successfully`,
      tasks
    });
  } catch (error) {
    console.error("Fetch Tasks by Status Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
},

updateTask :async (req, res) => {
  try {
    const taskId = req.params.id; 
    const { title, description, status, priority, dueDate } = req.body;

    // Find the task and make sure it belongs to logged-in user
    const task = await db.Task.findOne({ _id: taskId, user: req.userId });

    if (!task) {
      // If task not found or does not belong to user → unauthorized
      return res.status(403).json({ success: false, message: "You are not authorized to update this task or it does not exist" });
    }

    
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) {
      if (!["Pending", "Completed"].includes(status)) {
        return res.status(400).json({ success: false, message: "Status must be 'pending' or 'completed'" });
      }
      task.status = status;
    }
    if (priority) {
      if (!["Low", "Medium", "High"].includes(priority)) {
        return res.status(400).json({ success: false, message: "Priority must be 'low', 'medium', or 'high'" });
      }
      task.priority = priority;
    }
    if (dueDate) task.dueDate = dueDate;

   
    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
},
deleteTask: async (req, res) => {
  try {
    const  taskId  = req.params.id;
    
    const task = await db.Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    
    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }




    await db.Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });

  } catch (error) {
    console.error('Delete Task Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
},









};