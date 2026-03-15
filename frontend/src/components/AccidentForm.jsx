import React, { useState } from 'react'
import { createAccident } from '../services/api'

function AccidentForm({ onAdded }) {
  const [form, setForm] = useState({ date: '', time: '', location: '', severity: 'Moderate' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createAccident(form)
      setForm({ date: '', time: '', location: '', severity: 'Moderate' })
      onAdded()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="card form-card mb-4 fade-in">
      <div className="card-header" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: '#fff' }}>
        <span>{'\u{26A0}\u{FE0F}'}</span> Report New Accident
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" required
              value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Time</label>
            <input type="time" className="form-control" required
              value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Location</label>
            <input type="text" className="form-control" required placeholder="Enter location"
              value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Severity</label>
            <select className="form-select"
              value={form.severity} onChange={e => setForm({...form, severity: e.target.value})}>
              <option value="Low">Low</option>
              <option value="Moderate">Moderate</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-submit-danger">
              {'\u{2795}'} Report Accident
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AccidentForm
