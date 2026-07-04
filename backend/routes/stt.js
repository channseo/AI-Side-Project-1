import { Router } from 'express'
import multer from 'multer'
import OpenAI from 'openai'
import { toFile } from 'openai/uploads'

const upload = multer({ storage: multer.memoryStorage() })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const router = Router()

router.post('/', upload.single('audio'), async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'audio file is required' })
      return
    }

    const file = await toFile(req.file.buffer, req.file.originalname || 'answer.webm')
    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
    })

    res.json({ text: transcription.text })
  } catch (error) {
    next(error)
  }
})

export default router
