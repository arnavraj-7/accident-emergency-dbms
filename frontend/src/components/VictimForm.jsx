import React, { useState, useEffect } from 'react'
import { createVictim, getAccidents } from '../services/api'

function VictimForm({ onAdded }) {
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', contact: '', accident_id: '' })
  const [accidents, setAccidents] = useState([])

  useEffect(() => {
    getAccidents().then(res => setAccidents(res.data)).catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createVictim({ ...form, age: parseInt(form.age) })
      setForm({ name: '', age: '', gender: 'Male', contact: '', accident_id: '' })
      onAdded()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="card form-card mb-4 fade-in">
      <div className="card-header" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff' }}>
        <span>{'\u{1F9D1}\u{200D}\u{2695}\u{FE0F}'}</span> Add Victim
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" required placeholder="Full name"
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Age</label>
            <input type="number" className="form-control" required placeholder="Age"
              value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
          </div>
          <div className="col-md-2">
            <label className="form-label">Gender</label>
            <select className="form-select"
              value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label">Contact</label>
            <input type="text" className="form-control" placeholder="Phone number"
              value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Accident</label>
            <select className="form-select" required
              value={form.accident_id} onChange={e => setForm({...form, accident_id: e.target.value})}>
              <option value="">Select Accident</option>
              {accidents.map(a => (
                <option key={a.accident_id} value={a.accident_id}>
                  #{a.accident_id} - {a.location}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-submit-warning">
              {'\u{2795}'} Add Victim
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VictimForm
