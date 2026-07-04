import 'dotenv/config'

import cors from 'cors'
import express from 'express'

import analyzeRouter from './routes/analyze.js'
import questionsRouter from './routes/questions.js'
import sttRouter from './routes/stt.js'

const app = express()
const port = process.env.PORT ?? 3001

app.use(cors())
app.use(express.json())

app.use('/api/questions', questionsRouter)
app.use('/api/stt', sttRouter)
app.use('/api/analyze', analyzeRouter)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`)
})
