const express = require('express')
const cors = require('cors')
const app = express()
const jsonServer = require('json-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path')
const middleware = jsonServer.defaults(); 
require('dotenv').config(); 
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname,'db.json'));
const port = 3000; 
app.use(middleware);
app.use(express.json());
const cookieParser = require('cookie-parser');
const isSignedIn = require('./middleware');

app.use(cookieParser())
const secret = process.env.SECRET_KEY
app.use(cors()) 
let users=[] 
app.post('/api/register',async(req,res)=>{ 
    
  const { username, email, password } = req.body;
  
  
  const alreadyUser = router.db.get('users').value().find(u => u.email === email);
  if (alreadyUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Email is invalid" });
  }
  
  
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }
  
  // Validate password
  if (!password || password.length < 5) {
    return res.status(400).json({ message: "Password is required and must be greater than 5 characters" });
  }
  
  // Hash the password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Create a new user object
  const newUser = { id: Date.now(), username, email, password: hashedPassword };
  
  // Save the user to the database
  const users = router.db.get('users');
  users.push(newUser).write();
  
  // Send success response
  return res.status(200).json({ message: "User registered successfully" });
  

})
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

   
    if (username === 'admin' && password === 'admin@123') {
        console.log("received")
        const user = { id: 1, username: 'admin', email: 'admin@example.com' }; 
      const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
      
     
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure:true ,
        sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
    }

   
    const users = router.db.get('users').value();
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure:true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(400).json({ message: 'User login failed' });
  }
});

app.post('/api/logout',async(req,res)=>{
    res.cookie('auth_token','',{maxAge:0})
    return res.status(200).json({success:true,message:"Logged out successfully"})
})
app.get('/api/tasks', isSignedIn, (req, res) => {
  try {
    // Ensure userId is available from req.userInfo
    const userId = req.userInfo.userId;

    // Log for debugging
    console.log("User ID:", userId);

    // Fetch all tasks from DB
    const allTasks = router.db.get("tasks").value();
    
    // Filter tasks that belong to the logged-in user
    const tasks = allTasks.filter((task) => task.userId === userId);

    // Log tasks for debugging
    console.log("Sent tasks:", tasks);

    // Return the filtered tasks
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

app.post('/api/tasks', isSignedIn, async (req, res) => {
  const { title, description, status } = req.body;

  if (!title) return res.status(400).json({ message: "Title is missing" });
  if (!status) return res.status(400).json({ message: "Status is missing" });
  
  // Make sure to use req.userInfo.userId for task creation
  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    status: status || "Pending",
    userId: req.userInfo.userId, // Correct userId assignment
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  };

  // Save the new task
  const tasks = router.db.get('tasks').push(newTask).write();

  // Send the saved task as response
  const savedTask = router.db.get('tasks').find({ id: newTask.id }).value();
  res.status(200).json(savedTask);

  });

  app.put('/api/tasks/:id',isSignedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    console.log(id)
    const userId = req.userInfo.userId;
    const task = router.db.get('tasks').find({ id: id.toString(), userId: userId }).value();
    
    if (!task) {
      return res.status(400).json({ message: "Task Not Found or Unauthorized" });
    }
  
    const updatedTask = {
      ...task,
      title,
      description,
      status,
      updatedDate: new Date().toISOString(),
    };
  
    router.db.get('tasks').find({ id: parseInt(id) }).assign(updatedTask).write();
    res.status(200).json(updatedTask);
  });
  
  app.put('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const { userInfo } = req; 
  
    if (!userInfo) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const task = router.db.get('tasks').find({ id: parseInt(id), userId: userInfo.id }).value();
    
    if (!task) {
      return res.status(400).json({ message: "Task Not Found or Unauthorized" });
    }
  
    const updatedTask = {
      ...task,
      title,
      description,
      status,
      updatedDate: new Date().toISOString(),
    };
  
    router.db.get('tasks').find({ id: parseInt(id) }).assign(updatedTask).write();
    res.status(200).json(updatedTask);
  });
  
app.get('/api/tasks/:id/status',(req,res)=>{ 
    const {id} = req.params 
    const {status} = req.body 
    const validStatuses = ['Pending', 'Active', 'Complete'];
if (!validStatuses.includes(status.charAt(0).toUpperCase() + status.slice(1).toLowerCase())) {
    return res.status(400).json({ message: "Invalid Status" });
}
    const task = router.db.get('tasks').find({id:parseInt(id)}).value()
    if(!task) return res.status(400).json({message:"Task Not Found"})
    task.status = status 
    task.updatedDate = new Date.toISOString() 
    router.db.get('tasks').find({id:parseInt(id)}).assign(task).write() 
    res.json(task) 
})
app.delete('/api/tasks/:id', isSignedIn, async (req, res) => {
  const { id } = req.params;
  const userId = req.userInfo.userId;

  // Find the task by ID and ensure it belongs to the current user
  const task = router.db.get('tasks').find({ id: id.toString(), userId: userId }).value();

  if (!task) {
    return res.status(400).json({ message: "Task Not Found or Unauthorized" });
  }

  // Delete the task
  router.db.get('tasks').remove({ id: id.toString() }).write();

  // Respond with a success message
  res.status(200).json({ message: "Task deleted successfully" });
});

app.use((req, res, next) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        try {
            const decoded = jwt.verify(token, secret); 
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(400).json({ message: "Unauthorized" });
        }
    } else {
        return res.status(400).json({ message: "Unauthorized" });
    }
});
app.use(router) 
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});  