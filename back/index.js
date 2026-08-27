const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3001
const monkeytypeApiUrl = 'https://api.monkeytype.com'

app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }))

async function fetchMonkeytype(path) {
  const apeKey = process.env.MONKEYTYPE_API_KEY

  if (!apeKey) {
    const error = new Error('MONKEYTYPE_API_KEY is not configured on the server.')
    error.status = 500
    throw error
  }

  const response = await fetch(`${monkeytypeApiUrl}${path}`, {
    headers: { Authorization: `ApeKey ${apeKey}` }
  })
  const body = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(body?.message || 'Monkeytype could not return your account data.')
    error.status = response.status
    throw error
  }

  return body?.data
}

app.get('/api/monkeytype/test-activity', async (_request, response) => {
  try {
    const activity = await fetchMonkeytype('/users/currentTestActivity')
      

    response.json(activity)
  } catch (error) {
    const status = error.name === 'TimeoutError' ? 504 : error.status || 502
    response.status(status).json({ error: error.message || 'Unable to fetch Monkeytype data.' })
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
