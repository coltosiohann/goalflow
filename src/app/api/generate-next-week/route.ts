import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

// --- Types ---
type TaskType = 'plan' | 'learn' | 'practice' | 'review' | 'quiz' | 'boss_battle'

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
  correctAnswer: number
  explanation: string
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
  quiz?: { questions: RoadmapQuizQuestion[] }
  resources?: RoadmapResource[]
  xp_reward?: number
}

type TeacherResponse = {
  tasks: RoadmapTask[]
}

// --- Helpers ---
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  return new OpenAI({ apiKey })
}

const TEACHER_SYSTEM_PROMPT = `You are The Teacher, a Senior Engineer Mentor and world-class instructor.
Your goal is to generate detailed daily tasks for a specific range of days in a learning journey.

PEDAGOGICAL STRATEGY (Bloom's Taxonomy):
- Start with CONCEPTS (Remember/Understand)
- Move to APPLICATION (Apply/Analyze)
- End with CREATION (Evaluate/Create)

CRITICAL INSTRUCTIONS:
1. Content Depth: ACT AS A SENIOR MENTOR. Explain the *intuition* behind concepts with analogies.
2. RICH FORMATTING (Required):
   - Use **Bold** for key terms.
   - Use \`Code Blocks\` for ALL commands and code snippets.
   - Use Tables for comparisons.
   - Use > Blockquotes for pro tips.
3. Project-Based: The 'hands_on_exercise' MUST be a specific code component or feature.
   - BAD: "Practice coding."
   - GOOD: "Build a responsive Navigation Bar that collapses on mobile."
4. Volume: Generate 2-3 distinct tasks for EACH DAY in the requested range.
5. Task Types: Use varied types:
   - 'plan': Setup/Planning
   - 'learn': Theory, reading, watching
   - 'practice': Hands-on exercises
   - 'review': Quizzes
   - 'boss_battle': Only if this is the last day of a milestone.
6. Gamification:
   - Assign 'xp_reward': 10-20 for normal tasks, 50-100 for 'boss_battle'.
7. Quizzes:
   - Must have 3-5 questions.
   - MUST provide an 'explanation' for the correct answer.

OUTPUT FORMAT: valid JSON with strict structure:
{
  "tasks": [
    {
      "day_number": (absolute day number),
      "type": "...",
      "title": "...",
      "short_guide": "...",
      "learning_objectives": ["..."],
      "why_this_matters": "...",
      "detailed_content": "...",
      "hands_on_exercise": "...",
      "success_criteria": ["..."],
      "video_url": "...",
      "xp_reward": 10,
      "quiz": { 
          "questions": [ 
              { "question": "...", "options": ["..."], "correctAnswer": 0, "explanation": "..." } 
          ] 
      },
      "resources": []
    }
  ]
}`

const normalizeQuizQuestions = (
  quiz: any
): RoadmapQuizQuestion[] => {
  if (!quiz) return []
  const questions = Array.isArray(quiz) ? quiz : quiz.questions ?? []
  return questions.map((question: any, index: number) => ({
    ...question,
    id: question.id ?? `question-${index + 1}`,
    correctAnswer: question.correctAnswer ?? question.correct ?? 0
  }))
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goal_id, feedback } = body

    if (!goal_id) return NextResponse.json({ error: 'Missing goal_id' }, { status: 400 })

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch goal
    const { data: goal, error: goalError } = await supabase
      .from('goals')
      .select('id, title, timeframe_days, user_id')
      .eq('id', goal_id)
      .single()

    if (goalError || !goal || goal.user_id !== user.id) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 })
    }

    // Determine missing days
    const { data: allTasks } = await supabase
      .from('tasks')
      .select('day_number')
      .eq('goal_id', goal_id)
      .order('day_number', { ascending: true })

    const existingDays = new Set(allTasks?.map(t => t.day_number) || [])
    let startDay = 1
    while (existingDays.has(startDay) && startDay <= goal.timeframe_days) {
      startDay++
    }

    if (startDay > goal.timeframe_days) {
      return NextResponse.json({ error: 'All days already generated.' }, { status: 400 })
    }

    // Determine end day (generate chunk of up to 5 days, or until next existing task)
    let endDay = startDay
    const MAX_CHUNK = 5 // Slightly smaller chunk for stability with 2-3 tasks/day
    while (
      endDay < goal.timeframe_days &&
      (endDay - startDay + 1) < MAX_CHUNK &&
      !existingDays.has(endDay + 1)
    ) {
      endDay++
    }

    // Fetch milestones to link tasks
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('id, day_start, day_end')
      .eq('goal_id', goal_id)

    if (milestonesError || !milestones) return NextResponse.json({ error: 'Milestones missing' }, { status: 400 })

    // Call OpenAI
    const openai = getOpenAIClient()

    // Construct User Prompt
    let userPrompt = `
      Goal: "${goal.title}"
      Generate 2-3 distinct tasks for EACH DAY from Day ${startDay} to Day ${endDay}.
    `
    if (feedback) {
      if (feedback.difficulty) userPrompt += `\nAdjust difficulty: ${feedback.difficulty}.`
      if (feedback.time) userPrompt += `\nAdjust pacing: ${feedback.time}.`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: TEACHER_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const responseText = completion.choices[0].message.content
    if (!responseText) throw new Error('No response from AI')

    const data = JSON.parse(responseText) as TeacherResponse
    const newTasks = data.tasks || []

    // Insert tasks
    let tasksCreated = 0
    const taskErrors = []

    for (const task of newTasks) {
      // Find matching milestone
      const milestone = milestones.find(m => task.day_number >= m.day_start && task.day_number <= m.day_end)
      if (!milestone) continue // Skip if day out of range (shouldn't happen often)

      const normalizedQuiz = normalizeQuizQuestions(task.quiz)

      const { data: taskData, error: insertError } = await supabase
        .from('tasks')
        .insert({
          goal_id: goal_id,
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
          success_criteria: task.success_criteria || [],
          xp_reward: task.xp_reward || 10
        })
        .select()
        .single()

      if (insertError) {
        taskErrors.push({ task: task.title, error: insertError.message })
      } else {
        tasksCreated++
        // Resources
        if (task.resources && task.resources.length > 0) {
          await supabase.from('resources').insert(
            task.resources.map((r, i) => ({ ...r, task_id: taskData.id, order_index: i }))
          )
        }
      }
    }

    return NextResponse.json({
      success: true,
      tasks_created: tasksCreated,
      start_day: startDay,
      end_day: endDay
    })

  } catch (error) {
    console.error('Error generating next week:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
