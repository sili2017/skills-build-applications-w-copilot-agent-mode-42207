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

function formatCaptain(captain) {
  if (!captain) {
    return '-'
  }

  if (typeof captain === 'object') {
    return captain.fullName ?? captain.username ?? captain.name ?? captain._id ?? '-'
  }

  return captain
}

export default function Teams({ apiBaseUrl }) {
  const codespaceEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/teams/`
  const fallbackEndpoint = 'http://localhost:8000/api/teams/'
  const endpoint = apiBaseUrl
    ? `${apiBaseUrl}/teams/`
    : import.meta.env.VITE_CODESPACE_NAME
      ? codespaceEndpoint
      : fallbackEndpoint

  const [teams, setTeams] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadTeams() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(endpoint)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const rows = normalizeList(payload)

        if (!cancelled) {
          setTeams(rows)
          setTotal(extractTotal(payload, rows.length))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load teams')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadTeams()

    return () => {
      cancelled = true
    }
  }, [endpoint])

  return (
    <section>
      <h2 className="h4 mb-3">Teams</h2>
      <p className="text-body-secondary">Total records: {total}</p>

      {loading && <div className="alert alert-info">Loading teams...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Captain</th>
                <th>Members</th>
                <th>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id ?? team.id ?? team.name}>
                  <td>{team.name ?? '-'}</td>
                  <td>{team.description ?? '-'}</td>
                  <td>{formatCaptain(team.captain)}</td>
                  <td>{Array.isArray(team.members) ? team.members.length : '-'}</td>
                  <td>{team.totalPoints ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
