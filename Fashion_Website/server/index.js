import dotenv from 'dotenv'
import app from './app.js'

dotenv.config()

const requiredEnvironment = ['GOOGLE_CLIENT_ID', 'JWT_SECRET']
const missingEnvironment = requiredEnvironment.filter((name) => !process.env[name])

if (missingEnvironment.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvironment.join(', ')}`)
}

const port = process.env.PORT || 5050

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
