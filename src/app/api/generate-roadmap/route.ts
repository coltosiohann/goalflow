import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

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
- Include a healthy learning rhythm: learn → practice → review
- Provide high-quality, free resources when possible
- Create engaging quiz questions that test understanding, not just memorization

Each day should have 3-4 tasks of different types:
- PLAN: Overview, goal-setting, or reflection
- LEARN: New concepts, theory, or guided tutorials
- PRACTICE: Hands-on exercises or real-world application
- REVIEW: Quiz, recap, or consolidation`

  const domainSpecific: Record<string, string> = {
    web_development: `
DOMAIN: Web Development
- Focus on hands-on projects and practical coding
- Include official documentation and interactive platforms (MDN, freeCodeCamp, Scrimba)
- Build progressively: HTML/CSS → JavaScript → Framework → Backend → Deployment
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
- Gradual progression: basics → conversations → complex topics
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
- Progress through: data manipulation → visualization → statistics → ML
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

DAILY TASK GUIDELINES:
- 3-4 tasks per day (mix of plan, learn, practice, review types)
- Each task should take 15-20 minutes (total 45-80 min/day)
- Progressive difficulty throughout the journey

QUIZ REQUIREMENTS:
- 2-3 questions per task
- Multiple choice format with exactly 4 options
- Include clear explanations for correct answers
- Test understanding and application, not just facts

RESOURCE SELECTION:
- 2-4 resources per task
- Prioritize free, high-quality resources
- Include variety: videos, articles, interactive tools, practice platforms
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
      "short_guide": "Brief description of what to do (2-3 sentences)",
      "video_url": "https://youtube.com/watch?v=... or null",
      "quiz": {
        "questions": [
          {
            "question": "Question text?",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correct": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      },
      "resources": [
        {
          "label": "Resource name",
          "url": "https://...",
          "order_index": 0
        }
      ]
    }
  ]
}

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
    let roadmap: any
    try {
      const openai = getOpenAIClient()
      console.log('[API] Calling OpenAI API...')

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })

      console.log('[API] OpenAI response received')

      const responseText = completion.choices[0].message.content
      if (!responseText) {
        throw new Error('No response from OpenAI')
      }

      console.log('[API] Response length:', responseText.length)

      // Parse the JSON response
      roadmap = JSON.parse(responseText)
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
    const milestonesWithGoalId = roadmap.milestones.map((m: any) => ({
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
    console.log('[API] Creating tasks...')
    let tasksCreated = 0
    for (const task of roadmap.tasks) {
      const milestone = milestonesData[task.milestone_index]

      if (!milestone) {
        console.error('[API] Invalid milestone_index:', task.milestone_index)
        continue
      }

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
          quiz: task.quiz
        })
        .select()
        .single()

      if (taskError) {
        console.error('[API] Task creation error:', taskError)
        throw new Error(`Database error creating task: ${taskError.message}`)
      }

      tasksCreated++

      // Add resources for this task
      if (task.resources && task.resources.length > 0) {
        const resourcesWithTaskId = task.resources.map((r: any) => ({
          task_id: taskData.id,
          label: r.label,
          url: r.url,
          order_index: r.order_index
        }))

        const { error: resourcesError } = await supabase
          .from('resources')
          .insert(resourcesWithTaskId)

        if (resourcesError) {
          console.error('[API] Resources error:', resourcesError)
          // Continue anyway - resources are not critical
        }
      }
    }

    console.log('[API] Created', tasksCreated, 'tasks')
    console.log('[API] ✅ Roadmap generation complete!')

    return NextResponse.json({
      success: true,
      goal_id: goalId,
      domain,
      milestones_count: roadmap.milestones.length,
      tasks_count: roadmap.tasks.length
    })

  } catch (error) {
    console.error('[API] ❌ Error generating roadmap:', error)

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
