import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const Fixedaccount = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Add this line to get the location object
  const [formData, setFormData] = useState({
    fullname: '',
    email: (location.state && location.state.email) || '', // Initialize email with the passed email address
    nic: '',
    phonenumber: '',
    age: 0,
    amount: 0,
    maturityPeriod: '3 months',
    totalAmount: 0,
  });

  useEffect(() => {
    // Update the formData state with the email from the location state
    setFormData((prevFormData) => ({
      ...prevFormData,
      email: location.state?.email || '',
    }));
  }, [location.state]);  


  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nicError, setNicError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [amountError, setAmountError] = useState('');


  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove initial "0" from the age field if the user starts typing
    if (name === 'age' && value === '0') {
      setFormData({ ...formData, [name]: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Validate full name (no spaces or numbers allowed)
    const namePattern = /^[a-zA-Z]+$/;
    if (name === 'fullname' && !namePattern.test(value)) {
      setNameError('Full name must not contain spaces or numbers.');
    } else {
      setNameError('');
    }

    // Validate email address format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === 'email' && !emailPattern.test(value)) {
      setEmailError('The email must contain an "@" symbol & should not allow spaces.');
    } else {
      setEmailError('');
    }

    // Validate NIC number format (10 digits with 'V' as the last character or 12 digits)
    const nicPattern10Digits = /^[0-9]{9}V$/;
    const nicPattern12Digits = /^[0-9]{12}$/;
    if (name === 'nic' && !nicPattern10Digits.test(value) && !nicPattern12Digits.test(value)) {
      setNicError('NIC number should be either 10 digits with "V" or 12 digits.');
    } else {
      setNicError('');
    }

    // Validate phone number format (10 digits)
    const phoneNumberPattern = /^[0-9]{10}$/;
    if (name === 'phonenumber' && !phoneNumberPattern.test(value)) {
      setPhoneNumberError('Phone number should have exactly 10 digits.');
    } else {
      setPhoneNumberError('');
    }

    // Validate age field (only numbers allowed)
    const agePattern = /^[0-9]+$/;
    if (name === 'age' && !agePattern.test(value)) {
      setAgeError('Age should only contain numbers.');
    } else {
      setAgeError('');
    }

    // Validate amount field (only numbers allowed)
    const amountPattern = /^[0-9]+$/;
    if (name === 'amount' && !amountPattern.test(value)) {
      setAmountError('Amount should only contain numbers.');
    } else {
      setAmountError('');
    }

    // If the maturity period is changed, calculate the new total amount
    if (name === 'maturityPeriod') {
      calculateInterest();
    }
  };
  
      const calculateInterest = () => {
        // Convert amount to number for calculations
        const amount = parseFloat(formData.amount);
      
        // Calculate interest
        const interestRate = 0.15; // 15% interest rate (decimal representation)
      
        // Calculate interest for different maturity periods
        const maturityPeriodsInMonths = {
          '3 months': 3,
          '6 months': 6,
          '12 months': 12,
        };
      
        // Get the selected maturity period from the form data
        const selectedMaturityPeriod = formData.maturityPeriod;
      
        // Calculate interest for the selected maturity period
        const maturityPeriodInMonths = maturityPeriodsInMonths[selectedMaturityPeriod];
        const interest = (amount * interestRate * maturityPeriodInMonths) / 12;
      
        // Calculate total amount
        const totalAmount = amount + interest;
      
        // Update the state with totalAmount
        setFormData({ ...formData, totalAmount });
      };
      
      
  
      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          // Call the calculateInterest function to calculate the total amount
          calculateInterest();
    
          // Include the totalAmount field in the formData before sending the request
          const formDataWithTotalAmount = { ...formData, totalAmount: formData.totalAmount };
    
          const token = localStorage.getItem('token');

          // Now you can save the data to the database, including the totalAmount
          const response = await fetch('http://database-10.cyqgzaokta0g.eu-north-1.rds.amazonaws.com:3306/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `${token}`, // Include the token in the headers
            },
            body: JSON.stringify(formDataWithTotalAmount), // Send formDataWithTotalAmount instead of formData
          });
    
          if (response.ok) {
            // Data saved successfully
            console.log('Data saved successfully.');
    
            // Navigate to the home page after successful form submission
            navigate('/');
          } else {
            // Handle the response (e.g., show error message)
            const errorData = await response.json();
            console.log('Error:', errorData.message); // Adjust the error handling as needed
          }
        } catch (error) {
          console.error('Error:', error.message); // Handle any network errors
        }
      };

      const checkAuthentication = () => {
        const token = localStorage.getItem('token');
        if (!token) {
          // No token found, redirect to login page
          navigate('/login');
          return;
        }
      }
      


  return (
    <div className="fixed-account">
      <h1 className="ai-bank-text">
        <span style={{ color: 'rgb(81, 33, 205)' }}>AI</span> <span style={{ color: 'black' }}>BANK</span>
      </h1>
      <h1 className="form-title">Fixed Deposit Customer Details</h1>
      <form onSubmit={handleSubmit}>
      <div className="form-group">
          <label>Full Name:</label>
          <div className="input-container">
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
            />
            {nameError && <p className="error-message">{nameError}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <div className="input-container">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>NIC:</label>
          <div className="input-container">
            <input
              type="text"
              name="nic"
              value={formData.nic}
              onChange={handleChange}
            />
            {nicError && <p className="error-message">{nicError}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Phone number:</label>
          <div className="input-container">
            <input
              type="text"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
            />
            {phoneNumberError && <p className="error-message">{phoneNumberError}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Age:</label>
          <div className="input-container">
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
            />
            {ageError && <p className="error-message">{ageError}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Amount:</label>
          <div className="input-container">
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
          {amountError && <p className="error-message">{amountError}</p>}
          </div>
        </div>
        <div className="form-group">
          <label>Maturity Period:</label>
          <select
            name="maturityPeriod"
            value={formData.maturityPeriod}
            onChange={handleChange}
          >
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
          </select>
        </div>

        <div className="form-group">
        <label>Total Amount:</label>
        <div className="input-container">
        <input
          type="text"
          name="totalAmount"
          value={formData.totalAmount}
          readOnly
        />
        </div>
      </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};


export default Fixedaccount;