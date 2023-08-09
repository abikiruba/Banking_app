import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import signupimage from './signupimageai.png';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Check for valid email format and no spaces in email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Invalid email format.');
      return;
    } else {
      setEmailError('');
    }

    // Check for password requirements
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError(
        'Password must contain at least 8 characters, one special character, and one number.'
      );
      return;
    } else {
      setPasswordError('');
    }

    // Check for name validation (no spaces or numbers allowed, and should not be empty)
    const namePattern = /^[a-zA-Z]+$/;
    if (!namePattern.test(name)) {
      setNameError('Name must not contain spaces or numbers.');
      return;
    } else {
      setNameError('');
    }

    try {
      const response = await fetch('http://localhost:3002/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (response.ok) {
        // Redirect to the home page (e.g., '/home') and pass the email as state
        navigate('/fixedaccount', { state: { email } }); // Navigate to Fixed Account page
      } else {
        // Handle the response (e.g., show error message)
        const errorData = await response.json();
        console.log('Error:', errorData.message); // Adjust the error handling as needed
      }
    } catch (error) {
      console.error('Error:', error.message); // Handle any network errors
    }
  };

  return (
    <div className='signup-container'>
      <form onSubmit={handleSignupSubmit} className='signup-form'>
        <div className='namefield'>
          <label>Name:</label>
          <div className="name-input-container">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
            />
            {nameError && <p className="error-message">{nameError}</p>}
          </div>
        </div>
        <div className='emailfield'>
          <label>Email:</label>
          <div className="email-input-container">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            {emailError && <p className="error-message">{emailError}</p>}
          </div>
        </div>
        <div className='passwordfield'>
          <label>Password:</label>
          <div className="password-input-container">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              onFocus={() =>
                setPasswordError(
                  'Password must contain at least 8 characters, one special character, and one number.'
                )
              }
              onBlur={() => setPasswordError('')}
            />
            {passwordError && <p className="error-message">{passwordError}</p>}
          </div>
        </div>
        <div className='signupbutton'>
          <button type="submit">Signup</button>
        </div>
      </form>
      <div className='image-container'>
        <img src={signupimage} alt="Image_signup" className="signup-image" />
      </div>
    </div>
  );
};

export default Signup;
