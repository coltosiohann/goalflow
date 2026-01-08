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
  quiz?: RoadmapQuizQuestion[] | { questions: RoadmapQuizQuestion[] }
  resources?: RoadmapResource[]
}

type RoadmapMilestone = {
  title: string
  day_start: number
  day_end: number
  order_index: number
}

type RoadmapResponse = {
  milestones: RoadmapMilestone[]
  tasks: RoadmapTask[]
}

type TaskCreationError = {
  task: string
  error: string
}

const generateRoadmap = async (
  openai: OpenAI,
  systemPrompt: string,
  userPrompt: string
): Promise<RoadmapResponse> => {
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

  return JSON.parse(responseText) as RoadmapResponse
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

// Helper to get OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  return new OpenAI({ apiKey })
}

// Domain detection helper
function detectDomain(goal: string): string {
  const goalLower = goal.toLowerCase()

  if (goalLower.match(/web|react|javascript|html|css|website|frontend|backend|fullstack|node/)) {
    return 'web_development'
  }
  if (goalLower.match(/python|java|c\+\+|programming|coding|software|algorithm/)) {
    return 'programming'
  }
  if (goalLower.match(/spanish|french|german|japanese|chinese|language|fluent|conversational/)) {
    return 'language'
  }
  if (goalLower.match(/photography|design|art|drawing|music|creative|photoshop|illustrator/)) {
    return 'creative'
  }
  if (goalLower.match(/marketing|business|productivity|management|sales|entrepreneur/)) {
    return 'business'
  }
  if (goalLower.match(/data science|machine learning|ai|analytics|statistics/)) {
    return 'data_science'
  }

  return 'general'
}

// Build adaptive system prompt
function buildSystemPrompt(domain: string): string {
  const basePrompt = `You are an expert learning path designer. Your role is to create personalized, actionable learning roadmaps that help people achieve their goals.

IMPORTANT PRINCIPLES:
- Scale difficulty progressively from beginner to intermediate/advanced
- Make tasks achievable in 30-60 minutes per day
- Include a healthy learning rhythm: learn -> practice -> review
- Provide high-quality, free resources when possible
- Create engaging quiz questions that test understanding, not just memorization

Each day should have 1-2 focused tasks:
- PLAN: Day 1 setup and weekly check-ins
- LEARN: New concepts, theory, or guided tutorials
- PRACTICE: Hands-on exercises or real-world application
- REVIEW: Quiz, recap, or consolidation`

  const domainSpecific: Record<string, string> = {
    web_development: `
DOMAIN: Web Development
- Focus on hands-on projects and practical coding
- Include official documentation and interactive platforms (MDN, freeCodeCamp, Scrimba)
- Build progressively: HTML/CSS -> JavaScript -> Framework -> Backend -> Deployment
- Emphasize real-world project milestones
- Resources: Official docs, coding challenges, video tutorials, GitHub repos`,

    programming: `
DOMAIN: Programming
- Emphasize syntax, data structures, and algorithms
- Include coding practice platforms (LeetCode, HackerRank, Exercism)
- Balance theory with hands-on coding exercises
- Build small projects to reinforce concepts
- Resources: Official language docs, interactive tutorials, coding challenges`,

    language: `
DOMAIN: Language Learning
- Balance four skills: listening, speaking, reading, writing
- Start with high-frequency vocabulary and basic grammar
- Include cultural context and real-life scenarios
- Gradual progression: basics -> conversations -> complex topics
- Resources: Language apps (Duolingo, Memrise), podcasts, YouTube channels, conversation practice`,

    creative: `
DOMAIN: Creative Skills
- Balance technical fundamentals with artistic expression
- Include both theory (composition, principles) and practice (exercises, projects)
- Encourage daily practice and iteration
- Show examples and analyze work from masters
- Resources: Video tutorials, online galleries, critique communities, practice challenges`,

    business: `
DOMAIN: Business/Productivity
- Focus on frameworks, case studies, and practical application
- Include real-world examples and templates
- Emphasize actionable strategies and implementation
- Balance theory with practical exercises
- Resources: Articles, case studies, templates, video lessons`,

    data_science: `
DOMAIN: Data Science
- Start with programming basics (Python/R)
- Progress through: data manipulation -> visualization -> statistics -> ML
- Use real datasets for practice
- Include Jupyter notebooks and interactive tools
- Resources: Official docs, Kaggle, DataCamp, research papers`,

    general: `
DOMAIN: General Learning
- Adapt to the specific topic intelligently
- Balance theoretical knowledge with practical application
- Include varied resource types
- Create clear, measurable milestones
- Resources: Mix of articles, videos, exercises, and projects`
  }

  return basePrompt + '\n' + (domainSpecific[domain] || domainSpecific.general)
}

// Build user prompt
function buildUserPrompt(goal: string, timeframeDays: number): string {
  return `Create a personalized ${timeframeDays}-day learning roadmap for: "${goal}"

ROADMAP STRUCTURE:
- Divide the timeframe into 3-5 logical milestones
- Each milestone should represent a meaningful achievement
- Distribute ${timeframeDays} days across milestones proportionally

DAILY TASK GUIDELINES (IMPORTANT):
- Aim for 1-2 tasks per day
- Day 1 should include a PLAN task
- Use PLAN tasks only on Day 1 and weekly check-ins
- Keep tasks distinct day-to-day (no repeated titles or copy)
- Progressive difficulty throughout the journey

ENHANCED LEARNING CONTENT (CRITICAL):
For each task, provide comprehensive learning material:

1. LEARNING OBJECTIVES (3-5 specific outcomes)
   - What the learner will be able to DO after completing this task
   - Make them measurable and actionable
   - Example: "Create a responsive navigation menu using Flexbox"

2. WHY THIS MATTERS (2-3 sentences)
   - Real-world context and relevance
   - How this skill applies to their overall goal
   - Motivation and connection to bigger picture

3. DETAILED CONTENT (${timeframeDays <= 14 ? '200-300' : timeframeDays <= 30 ? '150-220' : '120-180'} words)
   - Step-by-step explanation of concepts
   - Clear, beginner-friendly language with examples
   - Break down complex ideas into digestible parts
   - Include code examples, diagrams descriptions, or scenarios
   - Explain the "how" and "why" behind each step

4. HANDS-ON EXERCISE (specific challenge)
   - Practical, self-contained exercise to apply the learning
   - Clear instructions and expected outcome
   - Should take 10-15 minutes to complete
   - Include hints or guidance if needed

5. SUCCESS CRITERIA (3-4 checkpoints)
   - How learners know they've mastered this task
   - Observable, testable outcomes
   - Example: "Your code runs without errors and displays correctly"

QUIZ REQUIREMENTS:
- Include a quiz only for REVIEW tasks
- 1 scenario-based question per quiz
- Multiple choice format with exactly 4 options
- Include a clear explanation for the correct answer

RESOURCE SELECTION:
- 0-2 resources per task with brief descriptions
- Prioritize free, high-quality resources
- Include variety across the week: videos, articles, interactive tools, practice platforms
- For each resource, explain WHAT it is and WHY it's useful (1 sentence)
- Ensure resources are appropriate for the skill level

OUTPUT FORMAT:
Return ONLY valid JSON (no markdown, no explanations) with this exact structure:
{
  "milestones": [
    {
      "title": "Milestone title",
      "day_start": 1,
      "day_end": 10,
      "order_index": 0
    }
  ],
  "tasks": [
    {
      "milestone_index": 0,
      "day_number": 1,
      "type": "plan",
      "title": "Task title",
      "short_guide": "Brief 2-3 sentence overview",
      "learning_objectives": [
        "Specific objective 1",
        "Specific objective 2",
        "Specific objective 3"
      ],
      "why_this_matters": "Real-world context explaining why this task is important and how it connects to the overall goal.",
      "detailed_content": "Comprehensive 400-600 word explanation with step-by-step instructions, examples, and clear explanations of concepts. Break down complex ideas. Include specific examples relevant to the domain.",
      "hands_on_exercise": "Specific practical exercise with clear instructions, expected outcome, and any hints needed. Should be completable in 10-15 minutes.",
      "success_criteria": [
        "Measurable checkpoint 1",
        "Measurable checkpoint 2",
        "Measurable checkpoint 3"
      ],
      "video_url": "https://youtube.com/watch?v=... or null",
      "quiz": {
        "questions": [
          {
            "question": "Scenario-based question testing understanding?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correct": 0,
            "explanation": "Detailed explanation of why this answer is correct and why others are wrong"
          }
        ]
      },
      "resources": [
        {
          "label": "Resource name",
          "url": "https://...",
          "description": "What this resource is and why it's useful for this task",
          "order_index": 0
        }
      ]
    }
  ]
}

IMPORTANT: Make the detailed_content truly educational and comprehensive. This is where the actual learning happens. Don't just list concepts - teach them with examples and explanations.

Remember: Return ONLY the JSON object, nothing else.`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goal, timeframe_days } = body

    console.log('[API] Received request:', { goal, timeframe_days })

    if (!goal || !timeframe_days) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[API] Authentication error:', authError)
      return NextResponse.json(
        { error: 'You must be logged in to create goals' },
        { status: 401 }
      )
    }

    console.log('[API] Authenticated user:', user.id)

    // Detect domain and build prompts
    const domain = detectDomain(goal)
    const systemPrompt = buildSystemPrompt(domain)
    const userPrompt = buildUserPrompt(goal, timeframe_days)

    console.log(`[API] Generating roadmap for domain: ${domain}`)

    // Get OpenAI client and call API
    let roadmap: RoadmapResponse
    try {
      const openai = getOpenAIClient()
      console.log('[API] Calling OpenAI API...')

      roadmap = await generateRoadmap(openai, systemPrompt, userPrompt)

      console.log('[API] Parsed roadmap:', {
        milestones: roadmap.milestones?.length || 0,
        tasks: roadmap.tasks?.length || 0
      })

      if (!roadmap.milestones || !roadmap.tasks) {
        throw new Error('Invalid roadmap structure from AI')
      }
    } catch (aiError) {
      console.error('[API] OpenAI Error:', aiError)
      throw new Error(`AI generation failed: ${aiError instanceof Error ? aiError.message : 'Unknown error'}`)
    }

    // 1. Create the goal (supabase client already created for auth)
    console.log('[API] Creating goal in database...')
    const { data: goalData, error: goalError } = await supabase
      .from('goals')
      .insert({
        title: goal,
        timeframe_days,
        status: 'active',
        user_id: user.id
      })
      .select()
      .single()

    if (goalError) {
      console.error('[API] Goal creation error:', goalError)
      throw new Error(`Database error creating goal: ${goalError.message}`)
    }

    const goalId = goalData.id
    console.log('[API] Goal created with ID:', goalId)

    // 2. Create milestones
    console.log('[API] Creating milestones...')
    const milestonesWithGoalId = roadmap.milestones.map((m) => ({
      goal_id: goalId,
      title: m.title,
      day_start: m.day_start,
      day_end: m.day_end,
      order_index: m.order_index
    }))

    const { data: milestonesData, error: milestonesError } = await supabase
      .from('milestones')
      .insert(milestonesWithGoalId)
      .select()

    if (milestonesError) {
      console.error('[API] Milestones creation error:', milestonesError)
      throw new Error(`Database error creating milestones: ${milestonesError.message}`)
    }

    console.log('[API] Created', milestonesData.length, 'milestones')

    // 3. Create tasks with resources
    console.log('[API] Creating tasks...', roadmap.tasks.length, 'tasks to create')
    let tasksCreated = 0
    const taskErrors: TaskCreationError[] = []

    for (let i = 0; i < roadmap.tasks.length; i++) {
      const task = roadmap.tasks[i]
      console.log(`[API] Creating task ${i + 1}/${roadmap.tasks.length}: ${task.title}`)

      const milestone = milestonesData[task.milestone_index]
      const normalizedQuiz = normalizeQuizQuestions(task.quiz)

      if (!milestone) {
        console.error('[API] Invalid milestone_index:', task.milestone_index, 'for task:', task.title)
        taskErrors.push({ task: task.title, error: 'Invalid milestone_index' })
        continue
      }

      try {
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .insert({
            goal_id: goalId,
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
          console.error(`[API] Task ${i + 1} creation error:`, taskError)
          taskErrors.push({ task: task.title, error: taskError.message })
          continue // Continue to next task instead of throwing
        }

        console.log(`[API] [OK] Task ${i + 1} created successfully:`, task.title)
        tasksCreated++

        // Add resources for this task
        if (task.resources && task.resources.length > 0) {
          const resourcesWithTaskId = task.resources.map((r) => ({
            task_id: taskData.id,
            label: r.label,
            url: r.url,
            description: r.description || '',
            order_index: r.order_index
          }))

          const { error: resourcesError } = await supabase
            .from('resources')
            .insert(resourcesWithTaskId)

          if (resourcesError) {
            console.error(`[API] Resources error for task ${i + 1}:`, resourcesError)
            // Continue anyway - resources are not critical
          } else {
            console.log(`[API] [OK] Added ${task.resources.length} resources for task ${i + 1}`)
          }
        }
      } catch (error) {
        console.error(`[API] Unexpected error creating task ${i + 1}:`, error)
        taskErrors.push({
          task: task.title,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
        // Continue to next task
      }
    }

    if (taskErrors.length > 0) {
      console.error('[API] Task creation errors:', taskErrors)
    }

    console.log('[API] Created', tasksCreated, 'tasks')
    console.log('[API] [OK] Roadmap generation complete!')

    return NextResponse.json({
      success: true,
      goal_id: goalId,
      domain,
      milestones_count: roadmap.milestones.length,
      tasks_count: roadmap.tasks.length,
      tasks_created: tasksCreated,
      tasks_failed: taskErrors.length,
      errors: taskErrors.length > 0 ? taskErrors : undefined
    })

  } catch (error) {
    console.error('[API] [FAIL] Error generating roadmap:', error)

    // Return detailed error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate roadmap'
    const errorStack = error instanceof Error ? error.stack : undefined

    console.error('[API] Error details:', { message: errorMessage, stack: errorStack })

    return NextResponse.json(
      {
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}
