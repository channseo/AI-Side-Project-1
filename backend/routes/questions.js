import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Router } from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const questionsPath = path.join(__dirname, '..', 'data', 'questions.json')

const router = Router()

router.get('/random', async (_req, res, next) => {
  try {
    const raw = await readFile(questionsPath, 'utf-8')
    const questionSets = JSON.parse(raw)
    const randomSet = questionSets[Math.floor(Math.random() * questionSets.length)]
    res.json(randomSet)
  } catch (error) {
    next(error)
  }
})

export default router
