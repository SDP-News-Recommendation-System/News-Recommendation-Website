const express = require('express');
const app = express();
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Serve static files from the root directory of the project
app.use(express.static(path.join(__dirname, 'NEWS WP')));


// Middleware to parse JSON bodies
app.use(express.json());

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'news_users',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    // Check if the username already exists in the database
    const userExistsQuery = 'SELECT * FROM users WHERE username = $1';
    const userExistsResult = await pool.query(userExistsQuery, [username]);

    if (userExistsResult.rows.length > 0) {
      return res.status(400).send('Username already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertUserQuery = 'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *';
    const insertedUser = await pool.query(insertUserQuery, [username, hashedPassword]);

    // Send response only if user was successfully inserted
    if (insertedUser.rows.length > 0) {
      return res.status(201).send('User registered successfully.');
    } else {
      return res.status(500).send('Failed to register user.');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).send('Internal Server Error.');
  }
});


// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    const getUserQuery = 'SELECT * FROM users WHERE username = $1';
    const userResult = await pool.query(getUserQuery, [username]);

    if (userResult.rows.length === 0) {
      return res.status(401).send('Invalid username or password.');
    }

    const user = userResult.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).send('Invalid username or password.');
    }

    // Passwords match, login successful
    return res.status(200).send('Login successful.');
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).send('Internal Server Error.');
  }
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
