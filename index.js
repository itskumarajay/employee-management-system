const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Utility functions
const readUsers = () => {
  try {
    return JSON.parse(fs.readFileSync('data.json', 'utf8'));
  } catch (err) {
    return [];
  }
};

const saveUsers = (users) => {
  fs.writeFileSync('data.json', JSON.stringify(users, null, 2));
};

const readEmployees = () => {
  try {
    const data = fs.readFileSync('employees.txt', 'utf8').trim();
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
};

const saveEmployees = (employees) => {
  fs.writeFileSync('employees.txt', JSON.stringify(employees, null, 2));
};

// Routes
app.get('/', (req, res) => {
  res.send(`
    <style>
      body {
        font-family: 'Arial', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        background-color: #e0f7fa;
        overflow: hidden;
      }
      .container {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 30px;
        max-width: 900px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background-color: #ffffff;
        animation: fadeIn 1s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .form-container {
        flex: 1;
        max-width: 400px;
      }
      h1 {
        text-align: center;
        color: #00796b;
        margin-bottom: 20px;
        font-size: 2.5rem;
        animation: slideIn 1s ease-out;
      }
      @keyframes slideIn {
        from { opacity: 0; transform: translateX(-50px); }
        to { opacity: 1; transform: translateX(0); }
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      input[type="text"], input[type="password"] {
        padding: 10px;
        border: 2px solid #00796b;
        border-radius: 5px;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      input[type="text"]:focus, input[type="password"]:focus {
        border-color: #004d40;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        outline: none;
      }
      button {
        padding: 12px;
        background-color: #00796b;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }
      button:hover {
        background-color: #004d40;
        transform: scale(1.05);
      }
      .link {
        text-align: center;
        margin-top: 10px;
      }
      .link a {
        color: #00796b;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease;
      }
      .link a:hover {
        color: #004d40;
      }
    </style>
    <div class="container">
      <div class="form-container">
        <h1>Sign Up</h1>
        <form action="/signup" method="post">
          <input type="text" name="username" placeholder="Username" required><br>
          <input type="password" name="password" placeholder="Password" required><br>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required><br>
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div class="form-container">
        <h1>Log In</h1>
        <form action="/login" method="post">
          <input type="text" name="username" placeholder="Username" required><br>
          <input type="password" name="password" placeholder="Password" required><br>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  `);
});

app.post('/signup', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const users = readUsers();

  if (password !== confirmPassword) {
    return res.send('Passwords do not match. Please try again.');
  }

  if (users.find(user => user.username === username)) {
    return res.send('Username already exists. Please choose another one.');
  }

  users.push({ username, password });
  saveUsers(users);
  // Redirect to login page after successful signup
  res.redirect('/');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = readUsers();

  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.send('Invalid credentials. Please try again.');
  }

  res.redirect(`/dashboard?username=${username}`);
});

app.get('/dashboard', (req, res) => {
  const { username } = req.query;
  if (!username) {
    return res.send('Unauthorized access');
  }

  const employees = readEmployees();
  res.send(`
    <style>
      body {
        font-family: 'Arial', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        background-color: #e0f7fa;
      }
      .container {
        max-width: 600px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background-color: #ffffff;
        animation: fadeIn 1s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      h1, h2, h3 {
        text-align: center;
        color: #00796b;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      input[type="text"] {
        padding: 10px;
        border: 2px solid #00796b;
        border-radius: 5px;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      button {
        padding: 12px;
        background-color: #00796b;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }
      button:hover {
        background-color: #004d40;
        transform: scale(1.05);
      }
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        background-color: #f1f8e9;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 10px;
        transition: background-color 0.3s ease;
      }
      li:hover {
        background-color: #c8e6c9;
      }
      .link a {
        color: #00796b;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease;
      }
      .link a:hover {
        color: #004d40;
      }
    </style>
    <div class="container">
      <h1>Welcome, ${username}</h1>
      <h2>Employee Management</h2>
      <form action="/add" method="post">
        <input type="hidden" name="username" value="${username}">
        <input type="text" name="name" placeholder="Employee Name" required><br>
        <input type="text" name="position" placeholder="Position" required><br>
        <input type="text" name="department" placeholder="Department" required><br>
        <button type="submit">Add Employee</button>
      </form>
      <h3>Current Employees</h3>
      <ul>
        ${employees.map((employee, index) => `
          <li>
            <strong>ID:</strong> ${index + 1}<br>
            <strong>Name:</strong> ${employee.name}<br>
            <strong>Position:</strong> ${employee.position}<br>
            <strong>Department:</strong> ${employee.department}<br>
            <span class="link">
              <a href="/delete?username=${username}&index=${index}">Delete</a>
              <a href="/edit?username=${username}&index=${index}">Edit</a>
            </span>
          </li>`).join('')}
      </ul>
      <div class="link"><a href="/">Logout</a></div>
    </div>
  `);
});

app.post('/add', (req, res) => {
  const { username, name, position, department } = req.body;
  if (!username) {
    return res.send('Unauthorized access');
  }

  const employees = readEmployees();
  employees.push({ name, position, department });
  saveEmployees(employees);
  res.redirect(`/dashboard?username=${username}`);
});

app.get('/delete', (req, res) => {
  const { username, index } = req.query;
  if (!username) {
    return res.send('Unauthorized access');
  }

  const employees = readEmployees();
  employees.splice(index, 1);
  saveEmployees(employees);
  res.redirect(`/dashboard?username=${username}`);
});

app.get('/edit', (req, res) => {
  const { username, index } = req.query;
  if (!username) {
    return res.send('Unauthorized access');
  }

  const employees = readEmployees();
  const employee = employees[index];
  res.send(`
    <style>
      body {
        font-family: 'Arial', sans-serif;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        background-color: #e0f7fa;
      }
      .container {
        max-width: 450px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        background-color: #ffffff;
        animation: fadeIn 1s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      h1 {
        text-align: center;
        color: #00796b;
      }
      form {
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      input[type="text"] {
        padding: 10px;
        border: 2px solid #00796b;
        border-radius: 5px;
        transition: border-color 0.3s ease, box-shadow 0.3s ease;
      }
      button {
        padding: 12px;
        background-color: #17a2b8;
        border: none;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1rem;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }
      button:hover {
        background-color: #138496;
        transform: scale(1.05);
      }
      .link a {
        display: inline-block;
        margin-top: 10px;
        color: #00796b;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s ease;
      }
      .link a:hover {
        color: #004d40;
      }
    </style>
    <div class="container">
      <h1>Edit Employee</h1>
      <form action="/update" method="post">
        <input type="hidden" name="username" value="${username}">
        <input type="hidden" name="index" value="${index}">
        <input type="text" name="name" value="${employee.name}" required><br>
        <input type="text" name="position" value="${employee.position}" required><br>
        <input type="text" name="department" value="${employee.department}" required><br>
        <button type="submit">Update</button>
      </form>
      <div class="link"><a href="/dashboard?username=${username}">Cancel</a></div>
    </div>
  `);
});

app.post('/update', (req, res) => {
  const { username, index, name, position, department } = req.body;
  if (!username) {
    return res.send('Unauthorized access');
  }

  const employees = readEmployees();
  employees[index] = { name, position, department };
  saveEmployees(employees);
  res.redirect(`/dashboard?username=${username}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
