import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';
import loginimage from './loginimageai.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://database-10.cyqgzaokta0g.eu-north-1.rds.amazonaws.com:3306/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      localStorage.setItem('jwtToken', token); // Store the JWT token in local storage
      navigate('/Viewaccount', { state: { email } });
    } else {
      // Handle the response (e.g., show error message)
    }
  };

  const handleCreateAccountClick = () => {
    // Navigate to the signup page when the button is clicked
    navigate('/signup');
  };


  return (
    <div className='loginform'>
      <div className='login-container'>
        <form onSubmit={handleLoginSubmit}>
          <div className='input-group'>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div className='input-group'>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <div className='loginbutton'>
            <button type="submit">Login</button>
          </div>
        </form>
        <div className='createbutton'>
          <button onClick={handleCreateAccountClick} className="createbtn">Create Account</button>
        </div>
      </div>
      <div className='image-container'>
        <img
          src={loginimage}
          alt="Image"
          className="login-image"
        />
      </div>
    </div>
  );
};

export default Login;
