

import { useEffect, useState } from 'react'

function App() {
  const [account, setAccount] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/monkeytype/account-stats')
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error)
        return payload
      })
      .then(setAccount)
      .catch((requestError) => setError(requestError.message))
  }, [])

  if (error) return <p>Could not load Monkeytype activity: {error}</p>
  if (!account) return <p>Loading Monkeytype account activity…</p>

  const { stats, activity } = account
  const recentActivity = activity.testsByDays.slice(-7)

  return (
    <main>
      <h1>Monkeytype activity</h1>
      <p>Completed tests: {stats.completedTests}</p>
      <p>Started tests: {stats.startedTests}</p>
      <p>Time typing: {Math.round(stats.timeTyping / 60)} minutes</p>
      <h2>Last 7 days</h2>
      <ul>
        {recentActivity.map((tests, index) => (
          <li key={index}>Day {index + 1}: {tests} tests</li>
        ))}
      </ul>
    </main>
  )
}

export default App
