import React, { useEffect, useState } from 'react'
import VehicleForm from '../components/VehicleForm'
import { getVehicles, deleteVehicle } from '../services/api'

function Vehicles() {
  const [vehicles, setVehicles] = useState([])

  const fetchData = async () => {
    try {
      const res = await getVehicles()
      setVehicles(res.data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle record?')) return
    try {
      await deleteVehicle(id)
      fetchData()
    } catch (err) {
      alert('Error deleting: ' + err.message)
    }
  }

  return (
    <div>
      <h2 className="page-title">
        <span className="title-icon">{'\u{1F697}'}</span> Vehicles
      </h2>
      <VehicleForm onAdded={fetchData} />

      <div className="card data-table-card fade-in">
        <div className="card-header">
          <span>{'\u{1F4CB}'}</span> Vehicle Records
          <span className="badge bg-light text-dark ms-auto">{vehicles.length} records</span>
        </div>
        <div className="card-body table-responsive p-0">
          {vehicles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{'\u{1F4AD}'}</div>
              <p>No vehicle records found. Add one using the form above.</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehicle Number</th>
                  <th>Type</th>
                  <th>Accident Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(v => (
                  <tr key={v.vehicle_id}>
                    <td><span className="fw-semibold">#{v.vehicle_id}</span></td>
                    <td><code style={{ color: '#1e293b', background: '#f1f5f9', padding: '.15rem .5rem', borderRadius: '.35rem', fontSize: '.85rem' }}>{v.vehicle_number}</code></td>
                    <td>
                      <span className="badge" style={{ background: '#6366f1', color: '#fff' }}>{v.vehicle_type}</span>
                    </td>
                    <td>{v.accident_location}</td>
                    <td>
                      <button className="btn btn-delete" onClick={() => handleDelete(v.vehicle_id)}>
                        {'\u{1F5D1}\u{FE0F}'} Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Vehicles
