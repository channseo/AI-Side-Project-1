import { Router } from 'express'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const DISCLAIMER = '본 결과는 AI 기반 추정치이며 실제 OPIC 성적과 차이가 있을 수 있습니다.'

const router = Router()

router.post('/', async (req, res, next) => {
  try {
    const { topic, answers } = req.body

    if (!topic || !Array.isArray(answers) || answers.length !== 3) {
      res.status(400).json({ message: 'topic and 3 answers are required' })
      return
    }

    const [answer1, answer2, answer3] = answers

    const prompt = `You are an English-speaking OPIC mock interview evaluator.
Topic: ${topic}
A1: ${answer1}
A2: ${answer2}
A3: ${answer3}

Evaluate the answers by:
- 예상 OPIC 레벨(IM1, IM2, IM3, IH, AL)
- 답변 길이
- 문장 다양성
- 시제 활용
- 논리적 흐름
- 질문 간 연결성
- 표현 반복 여부
- 스토리텔링

Return only valid JSON in this exact shape:
{
  "level": "...",
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "repeatedPhrases": ["...", "..."],
  "suggestions": ["...", "..."],
  "sampleAnswer": "..."
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    })

    const content = completion.choices[0]?.message?.content ?? '{}'
    const parsed = JSON.parse(content)

    res.json({ ...parsed, disclaimer: DISCLAIMER })
  } catch (error) {
    next(error)
  }
})

export default router
