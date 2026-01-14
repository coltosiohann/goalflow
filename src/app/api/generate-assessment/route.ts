import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// --- Types ---
export type AssessmentQuestion = {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    difficulty: 'easy' | 'medium' | 'hard'
    explanation: string
}

type ExaminerResponse = {
    questions: AssessmentQuestion[]
}

// --- Helper Functions ---
function getOpenAIClient() {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    return new OpenAI({ apiKey })
}

const EXAMINER_SYSTEM_PROMPT = `You are "The Examiner", an expert instructor designed to assess a student's proficiency in a specific topic.
Your goal is to generate 3 Multiple Choice Questions that effectively categorize a user as Novice, Intermediate, or Expert.

INSTRUCTIONS:
1. Generate exactly 3 questions:
   - Question 1: Easy/Fundamental (To verify they aren't a complete beginner)
   - Question 2: Intermediate (Application of concepts)
   - Question 3: Advanced (Complex/Niche knowledge)
2. Ensure options are plausible (no obvious joke answers).
3. Provide a clear explanation for the correct answer.

OUTPUT FORMAT: Strict JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "What is...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0, // Index 0-3
      "difficulty": "easy",
      "explanation": "..."
    }
  ]
}`

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { topic } = body

        if (!topic) {
            return NextResponse.json({ error: 'Missing topic' }, { status: 400 })
        }

        const openai = getOpenAIClient()

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { role: 'system', content: EXAMINER_SYSTEM_PROMPT },
                { role: 'user', content: `Topic: "${topic}"` }
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' }
        })

        const data = JSON.parse(completion.choices[0].message.content || '{}') as ExaminerResponse

        return NextResponse.json({ questions: data.questions })
    } catch (error) {
        console.error('[API] Error generating assessment:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
