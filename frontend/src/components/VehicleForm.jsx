import React, { useState, useEffect } from 'react'
import { createVehicle, getAccidents } from '../services/api'

function VehicleForm({ onAdded }) {
  const [form, setForm] = useState({ vehicle_number: '', vehicle_type: 'Car', accident_id: '' })
  const [accidents, setAccidents] = useState([])

  useEffect(() => {
    getAccidents().then(res => setAccidents(res.data)).catch(console.error)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await createVehicle(form)
      setForm({ vehicle_number: '', vehicle_type: 'Car', accident_id: '' })
      onAdded()
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="card form-card mb-4 fade-in">
      <div className="card-header" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: '#fff' }}>
        <span>{'\u{1F697}'}</span> Add Vehicle
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Vehicle Number</label>
            <input type="text" className="form-control" required placeholder="e.g. KA01AB1234"
              value={form.vehicle_number} onChange={e => setForm({...form, vehicle_number: e.target.value})} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Vehicle Type</label>
            <select className="form-select"
              value={form.vehicle_type} onChange={e => setForm({...form, vehicle_type: e.target.value})}>
              <option value="Car">Car</option>
              <option value="Truck">Truck</option>
              <option value="Motorcycle">Motorcycle</option>
              <option value="Bus">Bus</option>
              <option value="Auto">Auto</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-md-4">
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
            <button type="submit" className="btn btn-submit-info">
              {'\u{2795}'} Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VehicleForm
