import { useEffect, useState } from 'react'
import ActivityTable from './components/ActivityTable'

const activityUrl = 'http://127.0.0.1:3001/api/monkeytype/test-activity'

async function fetchWithRetry(url, { maxWaitMs = 15_000, intervalMs = 1_000 } = {}) {
  const startTime = Date.now()
  let lastError

  while (Date.now() - startTime < maxWaitMs) {
    try {
      return await fetch(url)
    } catch (error) {
      lastError = error
      await new Promise((resolve) => setTimeout(resolve, intervalMs))
    }
  }

  throw new Error(
    lastError
      ? 'Could not connect to the local backend. Please try again.'
      : 'Could not connect. Please check your internet connection.',
  )
}

function App() {
  const [testActivities, setTestActivities] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadActivity() {
      try {
        const response = await fetchWithRetry(activityUrl)
        const result = await response.json()

        if (!isCurrentRequest) {
          return
        }

        if (!response.ok) {
          setError(result.error || 'Something went wrong.')
          return
        }

        if (
          !result ||
          !Array.isArray(result.testsByDays) ||
          !Number.isFinite(Number(result.lastDay))
        ) {
          throw new Error('Monkeytype returned activity data in an unexpected format.')
        }

        setTestActivities(result)
      } catch (requestError) {
        if (isCurrentRequest) {
          setError(requestError.message || 'Unable to load your activity.')
        }
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false)
        }
      }
    }

    void loadActivity()

    return () => {
      isCurrentRequest = false
    }
  }, [reloadCount])

  const retry = () => {
    setIsLoading(true)
    setError(null)
    setReloadCount((count) => count + 1)
  }

  if (isLoading) {
    return <div className="status-message">Loading your activity…</div>
  }

  if (error) {
    return (
      <div className="status-message error">
        <p>{error}</p>
        <button onClick={retry}>Retry</button>
      </div>
    )
  }

  return (
    <ActivityTable
      epochLastDay={testActivities.lastDay}
      testsByDayOrder={testActivities.testsByDays}
    />
  )
}

export default App
