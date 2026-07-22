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

function formatOwner(user) {
  if (!user) {
    return '-'
  }

  if (typeof user === 'object') {
    return user.fullName ?? user.username ?? user.name ?? user._id ?? '-'
  }

  return user
}

export default function Workouts({ apiBaseUrl }) {
  const [workouts, setWorkouts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadWorkouts() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`${apiBaseUrl}/workouts/`)
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const rows = normalizeList(payload)

        if (!cancelled) {
          setWorkouts(rows)
          setTotal(extractTotal(payload, rows.length))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load workouts')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadWorkouts()

    return () => {
      cancelled = true
    }
  }, [apiBaseUrl])

  return (
    <section>
      <h2 className="h4 mb-3">Workouts</h2>
      <p className="text-body-secondary">Total records: {total}</p>

      {loading && <div className="alert alert-info">Loading workouts...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>User</th>
                <th>Category</th>
                <th>Muscles</th>
                <th>Minutes</th>
                <th>Difficulty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout._id ?? workout.id ?? `${workout.title}-${workout.scheduledFor}`}>
                  <td>{workout.title ?? '-'}</td>
                  <td>{formatOwner(workout.user)}</td>
                  <td>{workout.category ?? '-'}</td>
                  <td>{Array.isArray(workout.targetMuscleGroups) ? workout.targetMuscleGroups.join(', ') : '-'}</td>
                  <td>{workout.estimatedMinutes ?? '-'}</td>
                  <td>{workout.difficulty ?? '-'}</td>
                  <td>{workout.completed ? 'Completed' : 'Planned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
