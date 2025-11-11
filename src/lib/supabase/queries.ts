import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

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
  order_index: number
  created_at: string
}

export type Task = {
  id: string
  goal_id: string
  milestone_id: string
  day_number: number
  type: 'plan' | 'learn' | 'practice' | 'review'
  title: string
  short_guide: string
  video_url: string | null
  quiz: any // JSON field
  created_at: string
  resources?: Resource[] // Optional - fetched separately if needed
}

export type Progress = {
  id: string
  user_id: string
  task_id: string
  completed: boolean
  completed_at: string | null
  notes: string | null
  quiz_result: any | null
  created_at: string
  updated_at: string
}

// Client-side queries (use in client components)
export const clientQueries = {
  // Get user's goals
  async getGoals() {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Goal[]
  },

  // Get active goal
  async getActiveGoal() {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data as Goal | null
  },

  // Get milestones for a goal
  async getMilestones(goalId: string) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('milestones')
      .select('*')
      .eq('goal_id', goalId)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data as Milestone[]
  },

  // Get tasks for a goal
  async getTasks(goalId: string) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('goal_id', goalId)
      .order('day_number', { ascending: true })

    if (error) throw error
    return data as Task[]
  },

  // Get today's tasks
  async getTodaysTasks(goalId: string) {
    const supabase = createBrowserClient()

    // Get goal to calculate current day
    const { data: goal } = await supabase
      .from('goals')
      .select('created_at, timeframe_days')
      .eq('id', goalId)
      .single()

    if (!goal) return []

    const startDate = new Date(goal.created_at)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const currentDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const dayNumber = Math.min(currentDay, goal.timeframe_days)

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('goal_id', goalId)
      .eq('day_number', dayNumber)

    if (error) throw error
    return data as Task[]
  },

  // Get resources for a task
  async getResources(taskId: string) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('task_id', taskId)
      .order('order_index', { ascending: true })

    if (error) throw error
    return data as Resource[]
  },

  // Get user progress for all tasks
  async getProgress() {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('progress')
      .select('*')

    if (error) throw error
    return data as Progress[]
  },

  // Get progress for a specific task
  async getTaskProgress(taskId: string) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('task_id', taskId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as Progress | null
  },

  // Complete a task
  async completeTask(taskId: string, quizScore?: number, quizAnswers?: number[]) {
    const supabase = createBrowserClient()

    const progressData: any = {
      task_id: taskId,
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

    const { data, error } = await supabase
      .from('progress')
      .upsert(progressData, { onConflict: 'user_id,task_id' })
      .select()
      .single()

    if (error) throw error
    return data as Progress
  },

  // Get goal progress percentage
  async getGoalProgress(goalId: string) {
    const supabase = createBrowserClient()

    const { data: tasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('goal_id', goalId)

    if (!tasks || tasks.length === 0) return 0

    const { data: completedTasks } = await supabase
      .from('progress')
      .select('task_id')
      .eq('completed', true)
      .in('task_id', tasks.map(t => t.id))

    if (!completedTasks) return 0

    return Math.round((completedTasks.length / tasks.length) * 100)
  },

  // Get milestone progress percentage
  async getMilestoneProgress(milestoneId: string) {
    const supabase = createBrowserClient()

    const { data: tasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('milestone_id', milestoneId)

    if (!tasks || tasks.length === 0) return 0

    const { data: completedTasks } = await supabase
      .from('progress')
      .select('task_id')
      .eq('completed', true)
      .in('task_id', tasks.map(t => t.id))

    if (!completedTasks) return 0

    return Math.round((completedTasks.length / tasks.length) * 100)
  },

  // Calculate streak (consecutive days with completed tasks)
  async getStreak() {
    const supabase = createBrowserClient()

    const { data } = await supabase
      .from('progress')
      .select('completed_at')
      .eq('completed', true)
      .order('completed_at', { ascending: false })

    if (!data || data.length === 0) return 0

    // Simple streak calculation (can be improved)
    let streak = 0
    let currentDate = new Date()
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
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('goals')
      .insert({
        title,
        timeframe_days: timeframeDays,
        status: 'active',
      })
      .select()
      .single()

    if (error) throw error
    return data as Goal
  },
}

// Server-side queries (use in server components and API routes)
export const serverQueries = {
  // Same functions but using server client
  async getGoals() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Goal[]
  },

  async getActiveGoal() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('status', 'active')
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data as Goal | null
  },

  // Add more server functions as needed...
}
