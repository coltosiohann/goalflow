import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Helper to get OpenAI client
function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  return new OpenAI({ apiKey })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { goal, timeframe_days } = body

    console.log('[DEBUG] Testing roadmap generation for:', { goal, timeframe_days })

    const openai = getOpenAIClient()

    // Use the same prompt as the real endpoint
    const systemPrompt = `You are an expert learning path designer. Your role is to create personalized, actionable learning roadmaps that help people achieve their goals.

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

    const userPrompt = `Create a personalized ${timeframe_days}-day learning roadmap for: "${goal}"

ROADMAP STRUCTURE:
- Divide the timeframe into 3-5 logical milestones
- Each milestone should represent a meaningful achievement
- Distribute ${timeframe_days} days across milestones proportionally

DAILY TASK GUIDELINES (CRITICAL - MUST FOLLOW):
- You MUST create exactly 3-4 tasks for EVERY SINGLE DAY from day 1 through day ${timeframe_days}
- DO NOT SKIP ANY DAYS - every day from 1 to ${timeframe_days} must have tasks
- Distribute tasks across ALL milestones (not just the first one)
- Mix of types: plan, learn, practice, review
- Each task should take 15-20 minutes (total 45-80 min/day)
- Progressive difficulty throughout the journey
- TOTAL TASKS REQUIRED: ${timeframe_days * 3} to ${timeframe_days * 4} tasks
- Example for ${timeframe_days} days:
  * Day 1: 3-4 tasks
  * Day 2: 3-4 tasks
  * Day 3: 3-4 tasks
  * ... continue for EVERY day ...
  * Day ${timeframe_days}: 3-4 tasks
  * TOTAL: ${timeframe_days * 3}-${timeframe_days * 4} tasks

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
      "learning_objectives": ["Objective 1", "Objective 2"],
      "why_this_matters": "Context",
      "detailed_content": "Detailed explanation",
      "hands_on_exercise": "Practice exercise",
      "success_criteria": ["Criterion 1", "Criterion 2"],
      "video_url": null,
      "quiz": {
        "questions": [
          {
            "question": "Question?",
            "options": ["A", "B", "C", "D"],
            "correct": 0,
            "explanation": "Why"
          }
        ]
      },
      "resources": [
        {
          "label": "Resource name",
          "url": "https://...",
          "description": "What and why",
          "order_index": 0
        }
      ]
    }
  ]
}

VALIDATION CHECKLIST BEFORE RESPONDING:
✓ Did you create tasks for EVERY SINGLE day from day 1 to day ${timeframe_days}?
✓ Does each day have 3-4 tasks (check day 1, day 2, ... day ${timeframe_days})?
✓ Are tasks distributed across ALL milestones (not just the first milestone)?
✓ Total task count = ${timeframe_days * 3} to ${timeframe_days * 4} tasks?
✓ Mix of task types (plan, learn, practice, review)?
✓ No days are skipped or missing tasks?

Count your tasks: you should have approximately ${Math.floor(timeframe_days * 3.5)} tasks total.
If you have less than ${timeframe_days * 3} tasks, you MUST add more tasks to cover all ${timeframe_days} days.

If any answer is NO, revise your roadmap before returning it.

Remember: Return ONLY the JSON object, nothing else.`

    console.log('[DEBUG] Calling OpenAI...')

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

    const roadmap = JSON.parse(responseText)

    console.log('[DEBUG] Roadmap structure:', {
      milestones: roadmap.milestones?.length || 0,
      tasks: roadmap.tasks?.length || 0,
      tasksPerDay: {}
    })

    // Count tasks per day
    const tasksPerDay: Record<number, number> = {}
    if (roadmap.tasks) {
      for (const task of roadmap.tasks) {
        const day = task.day_number
        tasksPerDay[day] = (tasksPerDay[day] || 0) + 1
      }
    }

    console.log('[DEBUG] Tasks per day:', tasksPerDay)

    // Return detailed analysis
    return NextResponse.json({
      success: true,
      analysis: {
        milestones_count: roadmap.milestones?.length || 0,
        tasks_count: roadmap.tasks?.length || 0,
        tasks_per_day: tasksPerDay,
        expected_tasks: timeframe_days * 3, // Minimum expected (3 per day)
        first_task_sample: roadmap.tasks?.[0] || null,
        last_task_sample: roadmap.tasks?.[roadmap.tasks?.length - 1] || null
      },
      full_roadmap: roadmap
    })

  } catch (error) {
    console.error('[DEBUG] Error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
