import React, { useEffect, useState } from 'react'
import AccidentForm from '../components/AccidentForm'
import { getAccidents, deleteAccident } from '../services/api'

function Accidents() {
  const [accidents, setAccidents] = useState([])

  const fetchData = async () => {
    try {
      const res = await getAccidents()
      setAccidents(res.data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this accident and all related records?')) return
    try {
      await deleteAccident(id)
      fetchData()
    } catch (err) {
      alert('Error deleting: ' + err.message)
    }
  }

  const severityBadge = (severity) => {
    const cls = severity === 'Critical' ? 'severity-critical' :
                severity === 'High' ? 'severity-high' :
                severity === 'Moderate' ? 'severity-moderate' : 'severity-low'
    return cls
  }

  return (
    <div>
      <h2 className="page-title">
        <span className="title-icon">{'\u{26A0}\u{FE0F}'}</span> Accidents
      </h2>
      <AccidentForm onAdded={fetchData} />

      <div className="card data-table-card fade-in">
        <div className="card-header">
          <span>{'\u{1F4CB}'}</span> Accident Records
          <span className="badge bg-light text-dark ms-auto">{accidents.length} records</span>
        </div>
        <div className="card-body table-responsive p-0">
          {accidents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{'\u{1F4AD}'}</div>
              <p>No accident records found. Add one using the form above.</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {accidents.map(a => (
                  <tr key={a.accident_id}>
                    <td><span className="fw-semibold">#{a.accident_id}</span></td>
                    <td>{new Date(a.date).toLocaleDateString()}</td>
                    <td>{a.time}</td>
                    <td>{a.location}</td>
                    <td>
                      <span className={`badge ${severityBadge(a.severity)}`}>{a.severity}</span>
                    </td>
                    <td>
                      <button className="btn btn-delete" onClick={() => handleDelete(a.accident_id)}>
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

export default Accidents
