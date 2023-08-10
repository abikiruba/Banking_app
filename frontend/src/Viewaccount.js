import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

const Viewaccount = () => {
  const location = useLocation();
  const email = (location.state && location.state.email) || '';
  const [fixedDepositData, setFixedDepositData] = useState([]);

  // Fetch fixed deposit details for the logged-in user
  const fetchData = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      // Handle not logged in scenario
      return;
    }

    try {
      const response = await fetch(`http://database-10.cyqgzaokta0g.eu-north-1.rds.amazonaws.com:3306/Viewaccount/${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setFixedDepositData(data);
      } else {
        console.error('Error:', response.status);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [email]);

  return (
    <div>
      <h1 className='heading'><span style={{ color: 'rgb(81, 33, 205)', fontWeight: 'bold' }}>Fixed Deposit</span> Details for <span style={{ color: 'rgb(81, 33, 205)', fontWeight: 'bold' }}>{email}</span></h1>
      {fixedDepositData.length > 0 ? (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>NIC</th>
                <th>Phone Number</th>
                <th>Age</th>
                <th>Amount</th>
                <th>Maturity Period</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {fixedDepositData.map((data) => (
                <tr key={data.id}>
                  <td>{data.fullname}</td>
                  <td>{data.nic}</td>
                  <td>{data.phonenumber}</td>
                  <td>{data.age}</td>
                  <td>{data.amount}</td>
                  <td>{data.maturityPeriod}</td>
                  <td>{data.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No fixed deposit details found for {email}</p>
      )}
    </div>
  );
};

export default Viewaccount;
