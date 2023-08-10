const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Sequelize = require('sequelize');

const app = express();
const port = 3002; // Change this to a different port number

const dbConfig = {
  host: 'bankingapp-rds.cyqgzaokta0g.eu-north-1.rds.amazonaws.com',
  username: 'bankingapp',
  password: 'sathu0530A.',
  database: 'bankingapp-rds',
  dialect: 'mysql',
};

// Create a Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
});

// Define User model
const User = sequelize.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
});

// Define FixedDeposit model
const FixedDeposit = sequelize.define('fixed_deposit', {
  fullname: Sequelize.STRING,
  email: Sequelize.STRING,
  nic: Sequelize.STRING,
  phonenumber: Sequelize.STRING,
  age: Sequelize.INTEGER,
  amount: Sequelize.DECIMAL,
  maturityPeriod: Sequelize.INTEGER,
  totalAmount: Sequelize.DECIMAL,
});

// Sync the models with the database
sequelize.sync()
  .then(() => {
    console.log('Models synced with the database.');
  })
  .catch((error) => {
    console.error('Error syncing models:', error);
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
