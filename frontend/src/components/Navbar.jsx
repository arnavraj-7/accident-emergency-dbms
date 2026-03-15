import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const navItems = [
    { path: '/',          label: 'Dashboard',  icon: '\u{1F4CA}' },
    { path: '/accidents', label: 'Accidents',  icon: '\u{26A0}\u{FE0F}' },
    { path: '/victims',   label: 'Victims',    icon: '\u{1F6D1}' },
    { path: '/vehicles',  label: 'Vehicles',   icon: '\u{1F697}' },
    { path: '/responses', label: 'Responses',  icon: '\u{1F6D1}' }
  ]

  return (
    <nav className="navbar navbar-expand-lg app-navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="brand-icon">{'\u{1F6A8}'}</span>
          Emergency Response System
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto">
            {navItems.map(item => (
              <li className="nav-item" key={item.path}>
                <Link
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
