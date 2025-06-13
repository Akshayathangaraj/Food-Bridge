import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import LanguageSwitcher from './components/LanguageSwitcher';
import Home from './components/Home';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import Donate from './components/Donate'; // Add if exists
import FoodAvailable from './components/FoodAvailable'; // Add if exists
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <LanguageSwitcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/user/:userId/donate" element={<Donate />} />
        <Route path="/user/:userId/food-available" element={<FoodAvailable />} />
      </Routes>
    </Router>
  );
}

export default App;
