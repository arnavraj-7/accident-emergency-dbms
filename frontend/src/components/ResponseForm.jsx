import React, { useState, useEffect } from 'react'
import { createResponse, getDropdownData } from '../services/api'

function ResponseForm({ onAdded }) {
  const [form, setForm] = useState({ response_time: '', accident_id: '', team_id: '', hospital_id: '' })
  const [dropdowns, setDropdowns] = useState({ accidents: [], teams: [], hospitals: [] })

  useEffect(() => {
    getDropdownData()
      .then(res => setDropdowns(res.data))
      .catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createResponse(form)
      setForm({ response_time: '', accident_id: '', team_id: '', hospital_id: '' })
      onAdded()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="card form-card mb-4 fade-in">
      <div className="card-header" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff' }}>
        <span>{'\u{1F6D1}'}</span> Record Response
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Response Time</label>
            <input type="datetime-local" className="form-control" required
              value={form.response_time} onChange={e => setForm({...form, response_time: e.target.value})} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Accident</label>
            <select className="form-select" required
              value={form.accident_id} onChange={e => setForm({...form, accident_id: e.target.value})}>
              <option value="">Select Accident</option>
              {dropdowns.accidents?.map(a => (
                <option key={a.accident_id} value={a.accident_id}>
                  #{a.accident_id} - {a.location}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Emergency Team</label>
            <select className="form-select" required
              value={form.team_id} onChange={e => setForm({...form, team_id: e.target.value})}>
              <option value="">Select Team</option>
              {dropdowns.teams?.map(t => (
                <option key={t.team_id} value={t.team_id}>{t.team_name}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">Hospital</label>
            <select className="form-select" required
              value={form.hospital_id} onChange={e => setForm({...form, hospital_id: e.target.value})}>
              <option value="">Select Hospital</option>
              {dropdowns.hospitals?.map(h => (
                <option key={h.hospital_id} value={h.hospital_id}>{h.hospital_name}</option>
              ))}
            </select>
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-submit-success">
              {'\u{2795}'} Record Response
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ResponseForm
