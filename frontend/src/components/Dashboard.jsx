import React, { useEffect, useState } from 'react'
import { getAccidents, getVictims, getVehicles, getResponses, runTransactionDemo } from '../services/api'

function Dashboard() {
  const [counts, setCounts] = useState({ accidents: 0, victims: 0, vehicles: 0, responses: 0 })
  const [severityStats, setSeverityStats] = useState({})
  const [recentAccidents, setRecentAccidents] = useState([])
  const [demoLogs, setDemoLogs] = useState([])
  const [demoRunning, setDemoRunning] = useState(false)

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [a, v, vh, r] = await Promise.all([
          getAccidents(), getVictims(), getVehicles(), getResponses()
        ])
        setCounts({
          accidents: a.data.length,
          victims:   v.data.length,
          vehicles:  vh.data.length,
          responses: r.data.length
        })

        // Analytics: severity breakdown
        const stats = {}
        a.data.forEach(acc => {
          stats[acc.severity] = (stats[acc.severity] || 0) + 1
        })
        setSeverityStats(stats)

        // Recent 3 accidents
        setRecentAccidents(a.data.slice(0, 3))
      } catch (err) {
        console.error('Error fetching counts:', err)
      }
    }
    fetchCounts()
  }, [])

  const handleDemo = async () => {
    setDemoRunning(true)
    setDemoLogs([])
    try {
      const res = await runTransactionDemo()
      setDemoLogs(res.data.logs)
    } catch (err) {
      setDemoLogs(['Error running demo: ' + (err.response?.data?.error || err.message)])
    }
    setDemoRunning(false)
  }

  const cards = [
    { title: 'Total Accidents',  count: counts.accidents, gradient: 'bg-gradient-danger',  icon: '\u{1F4A5}' },
    { title: 'Total Victims',    count: counts.victims,   gradient: 'bg-gradient-warning', icon: '\u{1F9D1}\u{200D}\u{2695}\u{FE0F}' },
    { title: 'Total Vehicles',   count: counts.vehicles,  gradient: 'bg-gradient-info',    icon: '\u{1F698}' },
    { title: 'Total Responses',  count: counts.responses, gradient: 'bg-gradient-success', icon: '\u{1F6D1}' }
  ]

  const severityBadge = (severity) => {
    const cls = severity === 'Critical' ? 'severity-critical' :
                severity === 'High' ? 'severity-high' :
                severity === 'Moderate' ? 'severity-moderate' : 'severity-low'
    return cls
  }

  return (
    <div>
      <h2 className="page-title">
        <span className="title-icon">{'\u{1F4CA}'}</span> Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="row g-4 mb-5">
        {cards.map((card, i) => (
          <div className={`col-md-3 col-sm-6 fade-in fade-in-delay-${i + 1}`} key={card.title}>
            <div className={`stat-card ${card.gradient}`}>
              <div className="card-body text-center">
                <div className="stat-icon">{card.icon}</div>
                <div className="stat-count">{card.count}</div>
                <div className="stat-label">{card.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reporting & Analytics Section */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 fade-in">
          <div className="card h-100">
            <div className="card-header" style={{ background: 'linear-gradient(135deg, #0a1628, #1b2f4b)', color: '#fff' }}>
              <span style={{ marginRight: '.5rem' }}>{'\u{1F4C8}'}</span>
              Severity Breakdown
            </div>
            <div className="card-body">
              {Object.keys(severityStats).length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{'\u{1F4AD}'}</div>
                  <p>No analytics data available yet</p>
                </div>
              ) : (
                Object.entries(severityStats).map(([severity, count]) => {
                  const colorMap = { Critical: 'danger', High: 'warning', Moderate: 'info', Low: 'success' }
                  const percent = counts.accidents > 0 ? Math.round((count / counts.accidents) * 100) : 0
                  return (
                    <div key={severity} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="fw-semibold" style={{ fontSize: '.88rem' }}>
                          <span className={`badge ${severityBadge(severity)} me-2`}>{severity}</span>
                        </span>
                        <span className="text-muted" style={{ fontSize: '.85rem' }}>{count} ({percent}%)</span>
                      </div>
                      <div className="progress" style={{ height: '10px' }}>
                        <div
                          className={`progress-bar bg-${colorMap[severity] || 'primary'}`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
        <div className="col-md-6 fade-in">
          <div className="card recent-card h-100">
            <div className="card-header" style={{ background: 'linear-gradient(135deg, #0a1628, #1b2f4b)', color: '#fff' }}>
              <span style={{ marginRight: '.5rem' }}>{'\u{1F550}'}</span>
              Recent Accidents
            </div>
            <ul className="list-group list-group-flush">
              {recentAccidents.length === 0 ? (
                <li className="list-group-item">
                  <div className="empty-state" style={{ padding: '1.5rem' }}>
                    <div className="empty-icon">{'\u{1F4CB}'}</div>
                    <p>No recent accident records</p>
                  </div>
                </li>
              ) : recentAccidents.map(a => (
                <li key={a.accident_id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <span className="fw-semibold">{a.location}</span>
                    <br />
                    <small className="text-muted">{new Date(a.date).toLocaleDateString()}</small>
                  </div>
                  <span className={`badge ${severityBadge(a.severity)}`}>{a.severity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Transaction Demo Section */}
      <div className="card demo-card fade-in mb-4">
        <div className="card-header">
          <h5 className="mb-0" style={{ fontSize: '1rem' }}>
            {'\u{2699}\u{FE0F}'} Transaction Control Demo
            <small className="ms-2 fw-normal" style={{ opacity: .7, fontSize: '.8rem' }}>DBMS Concept</small>
          </h5>
        </div>
        <div className="card-body">
          <p className="text-muted" style={{ fontSize: '.9rem' }}>
            This demo executes a real database transaction demonstrating
            <code className="mx-1">START TRANSACTION</code>,
            <code className="mx-1">SAVEPOINT</code>,
            <code className="mx-1">ROLLBACK TO SAVEPOINT</code>,
            <code className="mx-1">COMMIT</code>,
            and row-level locking (<code>FOR UPDATE</code>).
          </p>
          <button
            className="btn btn-accent mb-3"
            onClick={handleDemo}
            disabled={demoRunning}
          >
            {demoRunning ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Running...
              </>
            ) : (
              <>{'\u{25B6}\u{FE0F}'} Run Transaction Demo</>
            )}
          </button>

          {demoLogs.length > 0 && (
            <div className="demo-log">
              <h6 className="mb-3" style={{ color: '#94a3b8', fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Execution Log
              </h6>
              <ol>
                {demoLogs.map((log, i) => (
                  <li key={i}>
                    <code>{log}</code>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
