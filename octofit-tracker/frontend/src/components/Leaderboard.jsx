import { useEffect, useState } from 'react'

function normalizeList(payload) {
  if (Array.isArray(payload)) {
    return payload
  }

  if (payload?.item && typeof payload.item === 'object') {
    return [payload.item]
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

function formatEntity(item) {
  if (!item) {
    return '-'
  }

  if (typeof item === 'object') {
    return item.fullName ?? item.username ?? item.name ?? item._id ?? '-'
  }

  return item
}

function scoreFromEntry(entry) {
  return entry.points ?? entry.score ?? entry.totalPoints ?? '-'
}

export default function Leaderboard({ apiBaseUrl }) {
  const codespaceEndpoint = `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`
  const fallbackEndpoint = 'http://localhost:8000/api/leaderboard/'
  const endpoint = apiBaseUrl
    ? `${apiBaseUrl}/leaderboard/`
    : import.meta.env.VITE_CODESPACE_NAME
      ? codespaceEndpoint
      : fallbackEndpoint

  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadLeaderboard() {
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
          setRecords(rows)
          setTotal(extractTotal(payload, rows.length))
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to load leaderboard')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadLeaderboard()

    return () => {
      cancelled = true
    }
  }, [endpoint])

  return (
    <section>
      <h2 className="h4 mb-3">Leaderboard</h2>
      <p className="text-body-secondary">Total records: {total}</p>

      {loading && <div className="alert alert-info">Loading leaderboard...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <div className="row g-3">
          {records.map((record) => (
            <article className="col-12 col-lg-6" key={record._id ?? record.id ?? `${record.periodStart}-${record.periodEnd}`}>
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="h6 card-title mb-3">
                    {record.periodStart ? new Date(record.periodStart).toLocaleDateString() : 'N/A'} -{' '}
                    {record.periodEnd ? new Date(record.periodEnd).toLocaleDateString() : 'N/A'}
                  </h3>
                  <ol className="mb-0">
                    {(record.entries ?? []).map((entry, index) => (
                      <li key={entry._id ?? entry.id ?? `${index}-${scoreFromEntry(entry)}`}>
                        {formatEntity(entry.user ?? entry.team ?? entry.entity)}: {scoreFromEntry(entry)}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
