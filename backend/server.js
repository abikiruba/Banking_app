const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
// const port = 3306; // Change this to a different port number

const db = mysql.createConnection({
  host: 'database-10.cyqgzaokta0g.eu-north-1.rds.amazonaws.com',
  port: '3306',
  user: 'admin',    // Change 'username' to 'user'
  password: 'abi0902#',
  database: 'my_db',
});


db.connect((err) =>{
  if (err) {
    console.log(err.message);
    return;
  }
  console.log("Database connected.");
});


app.use(bodyParser.json());
app.use(cors());

const crypto = require('crypto');

const generateRandomString = (length) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

const secretKey = generateRandomString(32); // Generate a 32-byte (256-bit) secret key
console.log('Secret Key:', secretKey);

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email, password },
    });

    if (user) {
      const payload = { email: user.email };
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful.', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials.' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Failed to login.' });
  }
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const payload = { email: user.email };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    res.status(200).json({ message: 'Signup successful.', token });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Failed to signup.' });
  }
});

// Submit form data endpoint
app.post('/submit', async (req, res) => {
  const { fullname, email, nic, phonenumber, age, amount, maturityPeriod, totalAmount } = req.body;

  try {
    await FixedDeposit.create({
      fullname, email, nic, phonenumber, age, amount, maturityPeriod, totalAmount
    });
    res.status(200).json({ message: 'Data saved successfully.' });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Failed to save data.' });
  }
});

// View account endpoint
app.get('/Viewaccount/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const deposits = await FixedDeposit.findAll({
      where: { email },
    });
    res.status(200).json(deposits);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch fixed deposit details.' });
  }
});

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
