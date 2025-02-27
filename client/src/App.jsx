import React from 'react';
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserRoute from './Routing/UserRoute'
import AdminRoute from './Routing/AdminRoute';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/*' element={<UserRoute />} />
          <Route path='/admin/*' element={<AdminRoute />}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
