import { createClient as createBrowserClient } from '@/lib/supabase/client'

// Types (matching our database schema)
export type Goal = {
  id: string
  user_id: string
  title: string
  timeframe_days: number
  status: 'active' | 'completed' | 'paused'
  created_at: string
  updated_at: string
}

export type Milestone = {
  id: string
  goal_id: string
  title: string
  day_start: number
  day_end: number
  order_index: number
  created_at: string
}

export type Resource = {
  id: string
  task_id: string
  label: string
  url: string
  description?: string
  order_index: number
  created_at: string
}

export type QuizQuestion = {
  id?: string
  question: string
  options: string[]
  correctAnswer?: number
  correct?: number
  explanation?: string
}

export type Task = {
  id: string
  goal_id: string
  milestone_id: string
  day_number: number
  type: 'plan' | 'learn' | 'practice' | 'review' | 'quiz' | 'boss_battle'
  title: string
  short_guide: string
  video_url: string | null
  quiz: QuizQuestion[] | null
  learning_objectives?: string[]
  why_this_matters?: string
  detailed_content?: string
  hands_on_exercise?: string
  success_criteria?: string[]
  created_at: string
  resources?: Resource[] // Optional - fetched separately if needed
  xp_reward?: number // Phase 3: Gamification
  json_content?: any // Phase 3: For flexible content (Multi-question quizzes, etc)
}

export type Progress = {
  id: string
  user_id: string
  task_id: string
  completed: boolean
  completed_at: string | null
  notes: string | null
  quiz_result: {
    score: number
    answers: number[]
    completed_at: string
  } | null
  created_at: string
  updated_at: string
}

type QueryResult<T> = {
  data: T | null
  error: { message?: string; code?: string } | null
}

const isJwtExpired = (error?: { message?: string } | null) =>
  Boolean(
    error?.message &&
    error.message.toLowerCase().includes('jwt') &&
    error.message.toLowerCase().includes('expired')
  )

const queryWithAuthRetry = async <T>(
  query: (supabase: ReturnType<typeof createBrowserClient>) => PromiseLike<QueryResult<T>>
): Promise<QueryResult<T>> => {
  const supabase = createBrowserClient()
  let result = await query(supabase)
  if (result.error && isJwtExpired(result.error)) {
    const { error: refreshError } = await supabase.auth.refreshSession()
    if (!refreshError) {
      result = await query(supabase)
    }
  }
  return result
}

// Client-side queries (use in client components)
export const clientQueries = {
  // Get user's goals
  async getGoals() {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false })
    )

    if (error) throw error
    return data as Goal[]
  },

  // Get active goals (all of them)
  async getActiveGoals() {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('goals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
    )

    if (error) throw error
    return data as Goal[]
  },

  // Get the most recent active goal (for backward compatibility)
  async getActiveGoal() {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('goals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
    )

    if (error) throw error
    return data && data.length > 0 ? (data[0] as Goal) : null
  },

  // Get milestones for a goal
  async getMilestones(goalId: string) {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('milestones')
        .select('*')
        .eq('goal_id', goalId)
        .order('order_index', { ascending: true })
    )

    if (error) throw error
    return data as Milestone[]
  },

  // Get tasks for a goal
  async getTasks(goalId: string) {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('tasks')
        .select('*')
        .eq('goal_id', goalId)
        .order('day_number', { ascending: true })
    )

    if (error) throw error
    return data as Task[]
  },

  // Get today's tasks
  async getTodaysTasks(goalId: string) {
    // Get goal to calculate current day
    const { data: goal, error: goalError } = await queryWithAuthRetry<{ created_at: string; timeframe_days: number }>(
      (supabase) =>
        supabase
          .from('goals')
          .select('created_at, timeframe_days')
          .eq('id', goalId)
          .single()
    )

    if (goalError) throw goalError
    if (!goal) return []

    const startDate = new Date(goal.created_at)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const dayNumber = Math.min(currentDay, goal.timeframe_days)

    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('tasks')
        .select('*')
        .eq('goal_id', goalId)
        .eq('day_number', dayNumber)
    )

    if (error) throw error
    return data as Task[]
  },

  // Get resources for a task
  async getResources(taskId: string) {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('resources')
        .select('*')
        .eq('task_id', taskId)
        .order('order_index', { ascending: true })
    )

    if (error) throw error
    return data as Resource[]
  },

  // Get user progress for all tasks
  async getProgress() {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('progress')
        .select('*')
    )

    if (error) throw error
    return data as Progress[]
  },

  // Get progress for a specific task
  async getTaskProgress(taskId: string) {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('progress')
        .select('*')
        .eq('task_id', taskId)
        .single()
    )

    if (error && error.code !== 'PGRST116') throw error
    return data as Progress | null
  },

  // Complete a task
  async completeTask(taskId: string, quizScore?: number, quizAnswers?: number[]) {
    const supabase = createBrowserClient()

    // Get current user
    let { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError && isJwtExpired(userError)) {
      const { error: refreshError } = await supabase.auth.refreshSession()
      if (!refreshError) {
        const refreshed = await supabase.auth.getUser()
        user = refreshed.data.user
        userError = refreshed.error
      }
    }
    if (!user) throw new Error('User not authenticated')

    const progressData: {
      task_id: string
      user_id: string
      completed: true
      completed_at: string
      quiz_result?: Progress['quiz_result']
    } = {
      task_id: taskId,
      user_id: user.id,
      completed: true,
      completed_at: new Date().toISOString(),
    }

    if (quizScore !== undefined) {
      progressData.quiz_result = {
        score: quizScore,
        answers: quizAnswers || [],
        completed_at: new Date().toISOString(),
      }
    }

    const { data, error } = await queryWithAuthRetry((client) =>
      client
        .from('progress')
        .upsert(progressData, { onConflict: 'user_id,task_id' })
        .select()
        .single()
    )

    if (error) throw error
    return data as unknown as Progress
  },

  // Get goal progress percentage
  async getGoalProgress(goalId: string) {
    const { data: tasks, error: tasksError } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('tasks')
        .select('id')
        .eq('goal_id', goalId)
    )

    if (tasksError) throw tasksError
    if (!tasks || tasks.length === 0) return 0

    const { data: completedTasks, error: completedError } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('progress')
        .select('task_id')
        .eq('completed', true)
        .in('task_id', tasks.map(t => t.id))
    )

    if (completedError) throw completedError
    if (!completedTasks) return 0

    return Math.round((completedTasks.length / tasks.length) * 100)
  },

  // Get milestone progress percentage
  async getMilestoneProgress(milestoneId: string) {
    const { data: tasks, error: tasksError } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('tasks')
        .select('id')
        .eq('milestone_id', milestoneId)
    )

    if (tasksError) throw tasksError
    if (!tasks || tasks.length === 0) return 0

    const { data: completedTasks, error: completedError } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('progress')
        .select('task_id')
        .eq('completed', true)
        .in('task_id', tasks.map(t => t.id))
    )

    if (completedError) throw completedError
    if (!completedTasks) return 0

    return Math.round((completedTasks.length / tasks.length) * 100)
  },

  // Calculate streak (consecutive days with completed tasks)
  async getStreak() {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('progress')
        .select('completed_at')
        .eq('completed', true)
        .order('completed_at', { ascending: false })
    )

    if (error) throw error
    if (!data || data.length === 0) return 0

    // Simple streak calculation (can be improved)
    let streak = 0
    const currentDate = new Date()
    currentDate.setHours(0, 0, 0, 0)

    for (const progress of data) {
      if (!progress.completed_at) continue

      const completedDate = new Date(progress.completed_at)
      completedDate.setHours(0, 0, 0, 0)

      const diffDays = Math.floor((currentDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === streak) {
        streak++
      } else if (diffDays > streak) {
        break
      }
    }

    return streak
  },

  // Create a new goal
  async createGoal(title: string, timeframeDays: number) {
    const { data, error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('goals')
        .insert({
          title,
          timeframe_days: timeframeDays,
          status: 'active',
        })
        .select()
        .single()
    )

    if (error) throw error
    return data as unknown as Goal
  },

  // Delete a goal (and all associated data via CASCADE)
  async deleteGoal(goalId: string) {
    const { error } = await queryWithAuthRetry((supabase) =>
      supabase
        .from('goals')
        .delete()
        .eq('id', goalId)
    )

    if (error) throw error
    return true
  },
}
