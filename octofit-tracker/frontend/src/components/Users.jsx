import { useEffect, useState } from 'react'

function normalizeList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.items)) {
    return payload.items
  }

  return []
}

function extractTotal(payload, fallbackLength) {
  const candidates = [payload?.count, payload?.total, payload?.totalCount, payload?.meta?.total]
  const totalValue = candidates.find((value) => Number.isFinite(value))
  return Number.isFinite(totalValue) ? totalValue : fallbackLength
}

export default function Users({ apiBaseUrl }) {
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadUsers() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${apiBaseUrl}/users/`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const rows = normalizeList(payload)

        if (!cancelled) {
          setUsers(rows)
          setTotal(extractTotal(payload, rows.length))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load users')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadUsers()

    return () => {
      cancelled = true
    }
  }, [apiBaseUrl])

  return (
    <section>
      <h2 className="h4 mb-3">Users</h2>
      <p className="text-body-secondary">Total records: {total}</p>

      {loading && <div className="alert alert-info">Loading users...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Fitness Level</th>
                <th>Weekly Goal (min)</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id ?? user.id ?? user.email}>
                  <td>{user.username ?? '-'}</td>
                  <td>{user.fullName ?? '-'}</td>
                  <td>{user.email ?? '-'}</td>
                  <td>{user.fitnessLevel ?? '-'}</td>
                  <td>{user.weeklyGoalMinutes ?? '-'}</td>
                  <td>{user.totalPoints ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
