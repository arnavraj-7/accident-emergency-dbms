import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import Accidents from './pages/Accidents'
import Victims from './pages/Victims'
import Vehicles from './pages/Vehicles'
import Responses from './pages/Responses'

function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-wrapper">
        <div className="container mt-4">
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/accidents" element={<Accidents />} />
            <Route path="/victims"   element={<Victims />} />
            <Route path="/vehicles"  element={<Vehicles />} />
            <Route path="/responses" element={<Responses />} />
          </Routes>
        </div>
      </div>
      <footer className="app-footer">
        <div className="container">
          Emergency Response System &mdash; DBMS Project &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </Router>
  )
}

export default App
