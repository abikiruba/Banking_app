// Home.js
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import coverimage from './backgroundimageai.png';
import bankimage from './bankimageai.jpg';
import './App.css';

const Home = () => {
  const location = useLocation();
  const email = (location.state && location.state.email) || '';
  const navigate = useNavigate(); // Add this line to get the navigate function

  const handleLogin = () => {
    // Navigate to the login page when the user clicks the login button
    navigate('/login');
  };

  return (
    <div className="cover-container">
      <h1 className="ai-bank-text">
        <span style={{ color: 'rgb(81, 33, 205)' }}>AI</span> <span style={{ color: 'black' }}>BANK</span>
      </h1>
      <div className="login-button-container">
        <button className="login-button" onClick={handleLogin}>Login</button>
      </div>
      <div className="grid-section">
        <div className="image-column">
          <img src={bankimage} alt="Image" />
        </div>
        <div className="text-column">
          <p>"We are delighted to introduce a new fixed deposit scheme at our bank, offering three maturity periods: 3 months, 6 months, and one year. This scheme comes with a competitive interest rate of 15%."</p>
          <div className="grid-section1">
            <div className='depositeadd'>
              <p><span style={{ color: 'rgb(81, 33, 205)', fontSize: '45px', fontWeight: 'bold' }}>15%</span></p>
              <p><span style={{ fontWeight: 'bold', color: 'rgb(81, 33, 205)' }}>03</span> Months</p>
              <p><span style={{ fontWeight: 'bold', color: 'rgb(81, 33, 205)' }}>06</span> Months</p>
              <p><span style={{ fontWeight: 'bold', color: 'rgb(81, 33, 205)' }}>12</span> Months</p>
            </div>
            <div className='depositecreate'>
            <Link
             to={{
             pathname: "/signup",
             state: { email: email },
             }}
  style={{ textDecoration: 'none', color: 'inherit' }}
>
  <p style={{ marginTop: '25px', fontSize: '25px' }}>Open <span style={{ color: 'rgb(81, 33, 205)', fontWeight: 'bold' }}>Fixed</span> Account</p>
</Link>

            </div><br />
            <div className='depositecreate1'>
            <Link
             to={{
             pathname: "/login",
             state: { email: email },
             }}
             style={{ textDecoration: 'none', color: 'inherit' }}>
                <p style={{ marginTop: '25px', fontSize: '25px' }}>View <span style={{ color: 'rgb(81, 33, 205)', fontWeight: 'bold' }}>Account</span></p>
            </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
