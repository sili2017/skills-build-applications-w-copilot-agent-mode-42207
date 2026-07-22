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

function formatActor(value) {
  if (!value) {
    return '-'
  }

  if (typeof value === 'object') {
    return value.fullName ?? value.username ?? value.name ?? value._id ?? '-'
  }

  return value
}

export default function Activities({ apiBaseUrl }) {
  const codespaceEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/activities/`
  const fallbackEndpoint = 'http://localhost:8000/api/activities/'
  const endpoint = apiBaseUrl
    ? `${apiBaseUrl}/activities/`
    : import.meta.env.VITE_CODESPACE_NAME
      ? codespaceEndpoint
      : fallbackEndpoint

  const [activities, setActivities] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadActivities() {
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
          setActivities(rows)
          setTotal(extractTotal(payload, rows.length))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load activities')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadActivities()

    return () => {
      cancelled = true
    }
  }, [endpoint])

  return (
    <section>
      <h2 className="h4 mb-3">Activities</h2>
      <p className="text-body-secondary">Total records: {total}</p>

      {loading && <div className="alert alert-info">Loading activities...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Type</th>
                <th>User</th>
                <th>Team</th>
                <th>Duration (min)</th>
                <th>Calories</th>
                <th>Performed</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id ?? activity.id ?? `${activity.type}-${activity.performedAt}`}>
                  <td>{activity.type ?? '-'}</td>
                  <td>{formatActor(activity.user)}</td>
                  <td>{formatActor(activity.team)}</td>
                  <td>{activity.durationMinutes ?? activity.duration ?? '-'}</td>
                  <td>{activity.caloriesBurned ?? activity.calories ?? '-'}</td>
                  <td>{activity.performedAt ? new Date(activity.performedAt).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
