const express = require('express')
const cors = require('cors')

const app = express()
const port = 3001
const host = '127.0.0.1'
const monkeytypeApiUrl = 'https://api.monkeytype.com'

app.use(express.json())
app.use(cors({
  origin(origin, callback) {
    const isAllowed = !origin || origin === 'null' || origin === 'http://localhost:5173'

    callback(isAllowed ? null : new Error('Origin is not allowed by CORS'), isAllowed)
  },
}))

async function fetchMonkeytype(path) {
  const apeKey = process.env.MONKEYTYPE_API_KEY
  const configFilePath = process.env.CONFIG_FILE_PATH

  if (!apeKey) {
    const location = configFilePath ? ` Add it to ${configFilePath}.` : ''
    const error = new Error(`MONKEYTYPE_API_KEY is not configured on the server.${location}`)
    error.status = 500
    throw error
  }

  const response = await fetch(`${monkeytypeApiUrl}${path}`, {
    headers: { Authorization: `ApeKey ${apeKey}` },
    signal: AbortSignal.timeout(15_000),
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

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`)
})
