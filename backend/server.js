const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');


const app = express();
const port = 3002; // Change this to a different port number

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'ABI_KIRUBA',
  password: 'abi0902#', // Use the database password from the environment variable
  database: 'BANK',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.use(bodyParser.json());
app.use(cors());
const jwt = require('jsonwebtoken');

  const crypto = require('crypto');

  const generateRandomString = (length) => {
    return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  };

  const secretKey = generateRandomString(32); // Generate a 32-byte (256-bit) secret key
  console.log('Secret Key:', secretKey);


// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check user credentials against the database
  pool.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, result) => {
      if (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Failed to login.' });
      } else {
          if (result.length > 0) {
             // Successful login, generate JWT token
            const payload = { email: email };
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
            res.status(200).json({ message: 'Login successful.', token: token });
          } else {
            // Invalid credentials
            res.status(401).json({ message: 'Invalid credentials.' });
          }
        }
    }
  );
});


// Signup endpoint
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  // Insert user data into the database
  pool.query(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password],
    (err, result) => {
      if (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Failed to signup.' });
      } else {
        // Successful signup, generate JWT token
        const payload = { email: email };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour
        res.status(200).json({ message: 'Signup successful.', token: token });
      }
    }
  );
});

// Submit form data endpoint
app.post('/submit', (req, res) => {
  const { fullname, email, nic, phonenumber, age, amount, maturityPeriod, totalAmount } = req.body;

  // Insert form data into the database
  pool.query(
    'INSERT INTO fixed_deposits (fullname, email, nic, phonenumber, age, amount, maturityPeriod, totalAmount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [fullname, email, nic, phonenumber, age, amount, maturityPeriod, totalAmount],
    (err, result) => {
      if (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Failed to save data.' });
      } else {
        res.status(200).json({ message: 'Data saved successfully.' });
      }
    }
  );
});

app.get('/Viewaccount/:email', (req, res) => {
  const { email } = req.params;

  // Fetch fixed deposit details for the specified user from the database
  pool.query(
    'SELECT * FROM fixed_deposits WHERE email = ?',
    [email],
    (err, result) => {
      if (err) {
        console.error('Error:', err.message);
        res.status(500).json({ message: 'Failed to fetch fixed deposit details.' });
      } else {
        res.status(200).json(result); // Return the fetched data as JSON response
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

