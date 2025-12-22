import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRoute from './Routing/UserRoute'
import AdminRoute from './Routing/AdminRoute';
import UnauthorizedPage from './components/UnauthorizedPage';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/*' element={<UserRoute />} />
          <Route path='/admin/*' element={<AdminRoute />}/>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
