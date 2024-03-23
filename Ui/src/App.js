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
import DepartmentList from './components/Department.js';
import QualificationList from './components/QualificationComponent.js';
import PageNotFound from './pages/PageNotFound';
import TestApp from './components/TestVoice';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userObj,setUserObj] = useState()
  useEffect(() => {
    // Check if the user is already logged in
    const user = localStorage.getItem('user');
    if (user) {
      setLoggedIn(true);
      setUserObj(user)
      
    }
  }, []);
  console.log(userObj)

  return (
    <Router>
      <div>
      {loggedIn &&
      <TopBar className="top-bar" />
}
        <div className="main-container">
        {loggedIn &&
         <Sidebar className="sidebar" />
         }
          {/* {loggedIn ? <Navigate to="/" /> : <Navigate to="/login" />} */}
          <div className="content">
            <Routes>
              <Route
                path='/'
                element={<LoginPage />}
              />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/patients' element={<PatientPage />} />
              <Route path='/admin' element={<AdminPage />} />
              <Route path='/admin/campaign' element={<CampaignComponent />} />
              <Route path='/reports' element={<Report />} />
              <Route path='/doctor' element={<DoctorDashboard />} />
              <Route path='/department' element={<DepartmentList />} />
              <Route path='/qualification' element={<QualificationList/>} />
              <Route path='/patient-history/:id' element={<PatientDetailsComponent />} /> 
              <Route path='/page-not-found' element={<PageNotFound />} /> 

              <Route path='/test' element={<TestApp />} />
              <Route path='*' element={<Navigate to="/login" />} /> Redirect to login page if no matching route

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