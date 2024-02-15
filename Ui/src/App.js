import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import TopBar from './components/Topbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Report from './pages/Reports';
import PatientPage from './pages/PatientManagement';
import AdminPage from './pages/Admin';
import LoginPage from './pages/LoginPage';
import Base from './components/basic/base';
import './css/app-style.css'; // Import CSS file
import './App.css';
import CampaignComponent from './components/admin_components/Campain';
import DoctorDashboard from './components/doctor_components/DoctorDashboard';
import PatientDetailsComponent from './components/doctor_components/PatientDetialsModel';

function App() {
  
  return (
    <Router>
      <div>
        <TopBar className="top-bar" />
        <div className="main-container">
          <Sidebar className="sidebar" />
          {/* {loggedIn ? <Navigate to="/" /> : <Navigate to="/login" />} */}
          <div className="content">
            <Routes>
              <Route
                path='/login'
                element={<LoginPage />}
              />
              <Route path='/' element={<Dashboard />} />
              <Route path='/patients' element={<PatientPage />} />
              <Route path='/admin' element={<AdminPage />} />
              <Route path='/admin/campaign' element={<CampaignComponent />} />
              <Route path='/reports' element={<Report />} />
              <Route path='/doctor' element={<DoctorDashboard />} />
              <Route path='/patient-history/:id' element={<PatientDetailsComponent />} /> 
            </Routes>
          </div>
        </div>
        
          <Footer
            className="footer"
          />
        
      </div>
    </Router>
  );
}

export default App;
