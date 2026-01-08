import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

type TaskType = 'plan' | 'learn' | 'practice' | 'review'

type RoadmapResource = {
  label: string
  url: string
  description?: string
  order_index: number
}

type RoadmapQuizQuestion = {
  id?: string
  question: string
  options: string[]
  correct?: number
  correctAnswer?: number
  explanation?: string
}

type RoadmapTask = {
  day_number: number
  type: TaskType
  title: string
  short_guide: string
  learning_objectives: string[]
  why_this_matters: string
  detailed_content: string
  hands_on_exercise: string
  success_criteria: string[]
  video_url: string | null
  quiz?: RoadmapQuizQuestion[] | { questions: RoadmapQuizQuestion[] }
  resources?: RoadmapResource[]
}

type RoadmapResponse = {
  tasks: RoadmapTask[]
}

const normalizeQuizQuestions = (
  quiz: RoadmapTask['quiz']
): RoadmapQuizQuestion[] => {
  if (!quiz) return []
  const questions = Array.isArray(quiz) ? quiz : quiz.questions ?? []
  return questions.map((question, index) => ({
    ...question,
    id: question.id ?? `question-${index + 1}`,
    correctAnswer: question.correctAnswer ?? question.correct ?? 0
  }))
}

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  return new OpenAI({ apiKey })
}

function buildSystemPrompt(): string {
  return `You are an expert learning path designer. Create a rich 7-day learning module with distinct daily tasks.

Guidelines:
- 1-2 tasks per day
- Keep tasks distinct day-to-day (no repeated titles or copy)
- Mix types: learn, practice, review, with plan only on the first day in the range
- Include a mini-project across the week (incremental steps)
- Day 7 should include a review task that summarizes the week
- Make tasks achievable in 60-90 minutes total per day
- Provide rich learning content (250-350 words)`
}

function buildUserPrompt(goal: string, startDay: number, endDay: number): string {
  return `Create a 7-day learning module for the goal: "${goal}"

Generate tasks ONLY for days ${startDay} through ${endDay}.

Rules:
- 1-2 tasks per day
- Use PLAN only on day ${startDay}
- Make each day distinct and progressively harder
- Include a mini-project with step-by-step progress across the week
- Day ${endDay} must include a REVIEW task that summarizes and assesses the week
- Provide learning objectives, why this matters, detailed content (250-350 words), and a hands-on exercise
- Include quiz only for REVIEW tasks (1 question with 4 options)
- Output ONLY valid JSON in this format:
{
  "tasks": [
    {
      "day_number": ${startDay},
      "type": "learn",
      "title": "Task title",
      "short_guide": "Brief 2-3 sentence overview",
      "learning_objectives": ["Objective 1", "Objective 2"],
      "why_this_matters": "Why this matters",
      "detailed_content": "Rich 250-350 word explanation",
      "hands_on_exercise": "Practice exercise",
      "success_criteria": ["Criterion 1", "Criterion 2"],
      "video_url": null,
      "quiz": {
        "questions": [
          {
            "question": "Scenario-based question?",
            "options": ["A", "B", "C", "D"],
            "correct": 0,
            "explanation": "Why this is correct"
          }
        ]
      },
      "resources": [
        {
          "label": "Resource name",
          "url": "https://...",
          "description": "Why it helps",
          "order_index": 0
        }
      ]
    }
  ]
}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goal_id, feedback } = body

    if (!goal_id) {
      return NextResponse.json(
        { error: 'Missing goal_id' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'You must be logged in to generate tasks' },
        { status: 401 }
      )
    }

    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id, title, timeframe_days, created_at, user_id')
      .eq('id', goal_id)
      .single()

    if (goalError || !goal || goal.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      )
    }

    const { data: latestTask } = await supabase
      .from('tasks')
      .select('day_number')
      .eq('goal_id', goal_id)
      .order('day_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    const currentMaxDay = latestTask?.day_number ?? 0
    const startDay = currentMaxDay + 1
    const endDay = Math.min(startDay + 6, goal.timeframe_days)

    if (startDay > goal.timeframe_days) {
      return NextResponse.json(
        { error: 'All days already generated for this goal.' },
        { status: 400 }
      )
    }

    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('id, day_start, day_end')
      .eq('goal_id', goal_id)
      .order('order_index', { ascending: true })

    if (milestonesError || !milestones || milestones.length === 0) {
      return NextResponse.json(
        { error: 'Milestones not found for this goal' },
        { status: 400 }
      )
    }

    const openai = getOpenAIClient()
    const systemPrompt = buildSystemPrompt()
    const feedbackLines: string[] = []
    if (feedback?.difficulty) {
      feedbackLines.push(`Difficulty feedback: ${feedback.difficulty}`)
    }
    if (feedback?.time) {
      feedbackLines.push(`Time feedback: ${feedback.time}`)
    }

    const feedbackContext =
      feedbackLines.length > 0
        ? `\n\nLearner feedback to adjust this week:\n- ${feedbackLines.join('\n- ')}\n`
        : ''

    const userPrompt = buildUserPrompt(goal.title, startDay, endDay) + feedbackContext

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0].message.content
    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    const roadmap = JSON.parse(responseText) as RoadmapResponse
    const tasks = Array.isArray(roadmap.tasks) ? roadmap.tasks : []

    const tasksToCreate = tasks.filter(
      (task) =>
        task &&
        typeof task.day_number === 'number' &&
        task.day_number >= startDay &&
        task.day_number <= endDay
    )

    if (tasksToCreate.length === 0) {
      return NextResponse.json(
        { error: 'AI did not return tasks for the requested days' },
        { status: 400 }
      )
    }

    let tasksCreated = 0
    const taskErrors: { task: string; error: string }[] = []

    for (const task of tasksToCreate) {
      const milestone = milestones.find(
        (m) => task.day_number >= m.day_start && task.day_number <= m.day_end
      )

      if (!milestone) {
        taskErrors.push({
          task: task.title,
          error: 'No matching milestone for task day'
        })
        continue
      }

      const normalizedQuiz = normalizeQuizQuestions(task.quiz)

      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          goal_id,
          milestone_id: milestone.id,
          day_number: task.day_number,
          type: task.type,
          title: task.title,
          short_guide: task.short_guide,
          video_url: task.video_url,
          quiz: normalizedQuiz.length > 0 ? normalizedQuiz : null,
          learning_objectives: task.learning_objectives || [],
          why_this_matters: task.why_this_matters || '',
          detailed_content: task.detailed_content || '',
          hands_on_exercise: task.hands_on_exercise || '',
          success_criteria: task.success_criteria || []
        })
        .select()
        .single()

      if (taskError) {
        taskErrors.push({ task: task.title, error: taskError.message })
        continue
      }

      tasksCreated++

      if (task.resources && task.resources.length > 0) {
        const resourcesWithTaskId = task.resources.map((r, index) => ({
          task_id: taskData.id,
          label: r.label,
          url: r.url,
          description: r.description || '',
          order_index: r.order_index ?? index
        }))

        const { error: resourcesError } = await supabase
          .from('resources')
          .insert(resourcesWithTaskId)

        if (resourcesError) {
          taskErrors.push({
            task: task.title,
            error: `Resources error: ${resourcesError.message}`
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      goal_id,
      start_day: startDay,
      end_day: endDay,
      tasks_created: tasksCreated,
      tasks_failed: taskErrors.length,
      errors: taskErrors.length > 0 ? taskErrors : undefined
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate tasks'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
