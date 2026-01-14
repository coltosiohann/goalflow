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
  explanation: string // Required now
}

type RoadmapTask = {
  milestone_index: number
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
  json_content?: any
}

type RoadmapMilestone = {
  title: string
  day_start: number
  day_end: number
  order_index: number
  description?: string
}

type ArchitectResponse = {
  milestones: RoadmapMilestone[]
}

type TeacherResponse = {
  tasks: RoadmapTask[]
}

// --- Helper Functions ---

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  return new OpenAI({ apiKey })
}

function detectDomain(goal: string): string {
  const goalLower = goal.toLowerCase()
  if (goalLower.match(/web|react|javascript|html|css|website|frontend|backend|fullstack|node/)) return 'web_development'
  if (goalLower.match(/python|java|c\+\+|programming|coding|software|algorithm/)) return 'programming'
  if (goalLower.match(/spanish|french|german|japanese|chinese|language|fluent|conversational/)) return 'language'
  if (goalLower.match(/photography|design|art|drawing|music|creative|photoshop|illustrator/)) return 'creative'
  if (goalLower.match(/marketing|business|productivity|management|sales|entrepreneur/)) return 'business'
  if (goalLower.match(/data science|machine learning|ai|analytics|statistics/)) return 'data_science'
  return 'general'
}

// --- Prompts ---

type UserLevel = 'Novice' | 'Intermediate' | 'Expert'

const ARCHITECT_SYSTEM_PROMPT = `You are The Architect, an expert technical curriculum designer.
Your goal is to design a PROJECT-BASED learning path for a specific goal, adapted to the student's current proficiency level.

INPUT:
- Goal: User's objective.
- Level: Novice, Intermediate, or Expert.

ADAPTATION LOGIC:
1. Novice: Start from absolute basics. Cover fundamentals thoroughly.
2. Intermediate: SKIP the introductions. Assume they know syntax/basics. specific "Refresher" if needed, then jump to Building.
3. Expert: Focus ONLY on advanced patterns, architecture, performance, and niche edge-cases.

CRITICAL INSTRUCTIONS:
1. Outcome-Oriented: Each milestone title should sound like a completed step.
2. Progression: Ensure a logical flow from Basics -> Implementation -> Polishing.
3. Focus: Do NOT generate daily tasks here. Just the high-level chapters.

OUTPUT FORMAT: valid JSON with strict structure:
{
  "milestones": [
    { "title": "...", "day_start": 1, "day_end": 10, "order_index": 0, "description": "High level summary" }
  ]
}`

const TEACHER_SYSTEM_PROMPT = `You are The Teacher, a Senior Engineer Mentor and world-class instructor.
Your goal is to generate detailed daily tasks for a SPECIFIC MILESTONE of a learning journey.

PEDAGOGICAL STRATEGY (Bloom's Taxonomy):
- Start with CONCEPTS (Remember/Understand)
- Move to APPLICATION (Apply/Analyze)
- End with CREATION (Evaluate/Create)

CRITICAL INSTRUCTIONS:
1. Content Depth: ACT AS A SENIOR MENTOR. Do not just say "Read this". Explain the *intuition* behind concepts.
2. Analogies: Explain complex technical concepts using real-world analogies (e.g., "An API is like a waiter in a restaurant...").
3. RICH FORMATTING (Required):
   - Use **Bold** for key terms.
   - Use \`Code Blocks\` for ALL commands and code snippets.
   - Use Tables for comparisons (e.g., "React vs Vue").
   - Use > Blockquotes for "Pro Tips" or "Warnings".
4. Project-Based: The 'hands_on_exercise' MUST be a specific component or feature they build today.
   - BAD: "Practice coding."
   - GOOD: "Build a responsive Navigation Bar that collapses on mobile."
5. Volume: Generate 2-3 distinct tasks for EACH DAY.
6. Gamification:
   - Assign 'xp_reward': 10-20 for normal tasks, 50-100 for 'boss_battle'.
7. Quizzes:
   - Must have 3-5 questions.
   - MUST provide an 'explanation' for the correct answer.

OUTPUT FORMAT: valid JSON with strict structure:
{
  "tasks": [
    {
      "milestone_index": (incoming index),
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

// --- Generators ---

async function generateMilestones(openai: OpenAI, goal: string, timeframe: number, domain: string, level: string = 'Novice'): Promise<RoadmapMilestone[]> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: ARCHITECT_SYSTEM_PROMPT },
      { role: 'user', content: `Goal: "${goal}"\nDuration: ${timeframe} days\nDomain: ${domain}\nLevel: ${level}\n\nDivide this into 3-5 logical milestones.` }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  })
  const data = JSON.parse(completion.choices[0].message.content || '{}') as ArchitectResponse
  return data.milestones || []
}

async function generateTasksForMilestone(
  openai: OpenAI,
  goal: string,
  milestone: RoadmapMilestone,
  domain: string,
  milestoneIndex: number
): Promise<RoadmapTask[]> {
  const userPrompt = `
    Goal: "${goal}"
    Context: Milestone ${milestoneIndex + 1}: "${milestone.title}" (Days ${milestone.day_start} to ${milestone.day_end}).
    Domain: ${domain}
    
    Generate 2-3 distinct tasks for EACH of these days (${milestone.day_end - milestone.day_start + 1} days total).
    Ensure the last task (Day ${milestone.day_end}) is a 'boss_battle'.
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: TEACHER_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  })

  const data = JSON.parse(completion.choices[0].message.content || '{}') as TeacherResponse

  // Post-processing to ensure correct indexing
  return (data.tasks || []).map(t => ({
    ...t,
    milestone_index: milestoneIndex,
    // Ensure day_number is within range if AI hallucinates
    day_number: Math.max(milestone.day_start, Math.min(milestone.day_end, t.day_number))
  }))
}


// --- Main Handler ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goal, timeframe_days, level } = body

    if (!goal || !timeframe_days) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const domain = detectDomain(goal)
    const openai = getOpenAIClient()

    // Step 1: Architect (Milestones)
    console.log(`[AI] Architect starting for ${level || 'Novice'} user...`)
    const milestones = await generateMilestones(openai, goal, timeframe_days, domain, level || 'Novice')
    console.log(`[AI] Architect created ${milestones.length} milestones.`)

    // Step 2: Teacher (Tasks) - Helper to run in parallel or sequence
    // Using sequence to avoid rate limits and massive token usage at once, 
    // but for 3-5 milestones parallel might be okay. Let's do sequence for safety/stability.
    let allTasks: RoadmapTask[] = []

    console.log('[AI] Teacher starting...')
    for (let i = 0; i < milestones.length; i++) {
      console.log(`[AI] Generating tasks for Milestone ${i + 1}...`)
      const tasks = await generateTasksForMilestone(openai, goal, milestones[i], domain, i)
      allTasks = [...allTasks, ...tasks]
    }
    console.log(`[AI] Teacher created ${allTasks.length} total tasks.`)

    // Database Insertion (similar to previous)

    // 1. Goal
    const { data: goalData, error: goalError } = await supabase
      .from('goals')
      .insert({ title: goal, timeframe_days, status: 'active', user_id: user.id })
      .select().single()
    if (goalError) throw new Error(goalError.message)

    // 2. Milestones
    const { data: dbMilestones, error: msError } = await supabase
      .from('milestones')
      .insert(milestones.map(m => ({
        goal_id: goalData.id,
        title: m.title,
        day_start: m.day_start,
        day_end: m.day_end,
        order_index: m.order_index
      })))
      .select()
    if (msError) throw new Error(msError.message)

    // 3. Tasks
    let tasksCreated = 0
    for (const task of allTasks) {
      const milestoneInfo = dbMilestones[task.milestone_index]
      if (!milestoneInfo) continue

      // Normalize Quiz
      let quizData = null
      if (task.quiz && task.quiz.questions && task.quiz.questions.length > 0) {
        quizData = task.quiz.questions.map((q, idx) => ({
          id: `q-${idx}`,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer, // New schema uses correctAnswer index
          explanation: q.explanation
        }))
      }

      const { data: taskData, error: taskError } = await supabase
        .from('tasks')
        .insert({
          goal_id: goalData.id,
          milestone_id: milestoneInfo.id,
          day_number: task.day_number,
          type: task.type,
          title: task.title,
          short_guide: task.short_guide,
          video_url: task.video_url,
          learning_objectives: task.learning_objectives,
          why_this_matters: task.why_this_matters,
          detailed_content: task.detailed_content,
          hands_on_exercise: task.hands_on_exercise,
          success_criteria: task.success_criteria,
          quiz: quizData,
          xp_reward: task.xp_reward || (task.type === 'boss_battle' ? 50 : 10),
          json_content: task.json_content
        })
        .select().single()

      if (!taskError && taskData) {
        tasksCreated++
        // Resources
        if (task.resources && task.resources.length > 0) {
          await supabase.from('resources').insert(
            task.resources.map(r => ({ ...r, task_id: taskData.id }))
          )
        }
      }
    }

    return NextResponse.json({ success: true, goal_id: goalData.id, tasks_created: tasksCreated })

  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
