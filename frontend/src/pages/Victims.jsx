import React, { useEffect, useState } from 'react'
import VictimForm from '../components/VictimForm'
import { getVictims, deleteVictim } from '../services/api'

function Victims() {
  const [victims, setVictims] = useState([])

  const fetchData = async () => {
    try {
      const res = await getVictims()
      setVictims(res.data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this victim record?')) return
    try {
      await deleteVictim(id)
      fetchData()
    } catch (err) {
      alert('Error deleting: ' + err.message)
    }
  }

  return (
    <div>
      <h2 className="page-title">
        <span className="title-icon">{'\u{1F9D1}\u{200D}\u{2695}\u{FE0F}'}</span> Victims
      </h2>
      <VictimForm onAdded={fetchData} />

      <div className="card data-table-card fade-in">
        <div className="card-header">
          <span>{'\u{1F4CB}'}</span> Victim Records
          <span className="badge bg-light text-dark ms-auto">{victims.length} records</span>
        </div>
        <div className="card-body table-responsive p-0">
          {victims.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{'\u{1F4AD}'}</div>
              <p>No victim records found. Add one using the form above.</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Contact</th>
                  <th>Accident Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {victims.map(v => (
                  <tr key={v.victim_id}>
                    <td><span className="fw-semibold">#{v.victim_id}</span></td>
                    <td>{v.name}</td>
                    <td>{v.age}</td>
                    <td>
                      <span className="badge" style={{
                        background: v.gender === 'Male' ? '#3b82f6' : v.gender === 'Female' ? '#ec4899' : '#8b5cf6',
                        color: '#fff'
                      }}>{v.gender}</span>
                    </td>
                    <td>{v.contact}</td>
                    <td>{v.accident_location}</td>
                    <td>
                      <button className="btn btn-delete" onClick={() => handleDelete(v.victim_id)}>
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

export default Victims
