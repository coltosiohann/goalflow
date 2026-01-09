import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const goalId = request.nextUrl.searchParams.get('goalId');

  if (!goalId) {
    const supabase = await createClient();
    const { data: recentGoals } = await supabase
      .from('goals')
      .select('id, title, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    // For each goal, get task count
    const goalsWithCounts = await Promise.all(
      (recentGoals || []).map(async (g) => {
        const { count } = await supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('goal_id', g.id);
        return { ...g, start_date: g.created_at, task_count: count };
      })
    );

    return NextResponse.json({ recentGoals: goalsWithCounts });
  }

  const supabase = await createClient();

  try {
    const { data: goal } = await supabase.from('goals').select('*').eq('id', goalId).single();
    const { data: milestones } = await supabase.from('milestones').select('*').eq('goal_id', goalId).order('day_start', { ascending: true });
    const { data: tasks } = await supabase.from('tasks').select('*').eq('goal_id', goalId).order('day_number', { ascending: true });

    // Check max day
    const maxTaskDay = tasks?.reduce((max, t) => Math.max(max, t.day_number), 0) || 0;

    return NextResponse.json({
      goal,
      milestonesCount: milestones?.length,
      tasksCount: tasks?.length,
      maxTaskDay,
      milestones,
      latestTasks: tasks?.slice(-5)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch debug info', details: error }, { status: 500 });
  }
}
