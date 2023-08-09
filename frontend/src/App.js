import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import Fixedaccount from './Fixedaccount';
import Viewaccount from './Viewaccount';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/fixedaccount' element={<Fixedaccount/>} />
          <Route path='/viewaccount' element={<Viewaccount/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
