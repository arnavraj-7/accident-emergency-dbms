import React, { useEffect, useState } from 'react'
import ResponseForm from '../components/ResponseForm'
import { getResponses, deleteResponse } from '../services/api'

function Responses() {
  const [responses, setResponses] = useState([])

  const fetchData = async () => {
    try {
      const res = await getResponses()
      setResponses(res.data)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this response record?')) return
    try {
      await deleteResponse(id)
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
        <span className="title-icon">{'\u{1F6D1}'}</span> Emergency Responses
      </h2>
      <ResponseForm onAdded={fetchData} />

      <div className="card data-table-card fade-in">
        <div className="card-header">
          <span>{'\u{1F4CB}'}</span> Response Records
          <span className="badge bg-light text-dark ms-auto">{responses.length} records</span>
        </div>
        <div className="card-body table-responsive p-0">
          {responses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">{'\u{1F4AD}'}</div>
              <p>No response records found. Record one using the form above.</p>
            </div>
          ) : (
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Response Time</th>
                  <th>Accident Location</th>
                  <th>Severity</th>
                  <th>Team</th>
                  <th>Hospital</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {responses.map(r => (
                  <tr key={r.response_id}>
                    <td><span className="fw-semibold">#{r.response_id}</span></td>
                    <td>{new Date(r.response_time).toLocaleString()}</td>
                    <td>{r.accident_location}</td>
                    <td>
                      <span className={`badge ${severityBadge(r.severity)}`}>{r.severity}</span>
                    </td>
                    <td>{r.team_name}</td>
                    <td>{r.hospital_name}</td>
                    <td>
                      <button className="btn btn-delete" onClick={() => handleDelete(r.response_id)}>
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

export default Responses
