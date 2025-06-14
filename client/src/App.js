import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import LanguageSwitcher from './components/LanguageSwitcher';
import Home from './components/Home';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import Donate from './components/Donate';
import FoodAvailable from './components/FoodAvailable';
import ProtectedRoute from './components/ProtectedRoute';
import MyDonations from './components/MyDonations'; 
import ClaimedList from './components/ClaimedList';



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
        <Route path="/user/:userId/my-donations" element={<MyDonations />} />
        <Route path="/user/:userId/my-donations" element={<ClaimedList />} />

      </Routes>
    </Router>
  );
}

export default App;
