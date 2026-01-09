import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { templates } from '@/data/templates';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { templateId } = body;

        if (!templateId) {
            return NextResponse.json({ error: 'Missing templateId' }, { status: 400 });
        }

        const template = templates.find((t) => t.id === templateId);
        if (!template) {
            return NextResponse.json({ error: 'Template not found' }, { status: 404 });
        }

        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // 1. Create Goal
        const { data: goalData, error: goalError } = await supabase
            .from('goals')
            .insert({
                title: template.title,
                timeframe_days: template.duration,
                status: 'active',
                user_id: user.id
            })
            .select()
            .single();

        if (goalError) throw new Error(`Goal creation failed: ${goalError.message}`);
        const goalId = goalData.id;

        // 2. Create Milestones
        // We need to map milestones and insert them. We also need to keep track of their IDs to link tasks.
        const milestonesToInsert = template.milestones.map((m, index) => ({
            goal_id: goalId,
            title: m.title,
            day_start: m.day_start,
            day_end: m.day_end,
            order_index: index,
        }));

        if (milestonesToInsert.length > 0) {
            const { data: insertedMilestones, error: milestonesError } = await supabase
                .from('milestones')
                .insert(milestonesToInsert)
                .select();

            if (milestonesError) throw new Error(`Milestone creation failed: ${milestonesError.message}`);

            // 3. Create Tasks
            // We need to map tasks to their correct milestone ID.
            // Since we inserted milestones in order, and 'insertedMilestones' should return in insertion order (or we match by index/title),
            // we can iterate through the template milestones again.

            // Safest strategy: Match by title and order_index if possible, or just rely on the array index alignment if Supabase guarantees it (it usually does for bulk insert return, but let's be safe).
            // Actually, easier to loop and insert one milestone + its tasks at a time? No, slower.
            // Let's assume index alignment for now, or match by order_index.

            const tasksToInsert: any[] = [];

            template.milestones.forEach((tmplMilestone, mIndex) => {
                const createdMilestone = insertedMilestones.find(im => im.order_index === mIndex);
                if (!createdMilestone) return;

                tmplMilestone.tasks.forEach(task => {
                    tasksToInsert.push({
                        goal_id: goalId,
                        milestone_id: createdMilestone.id,
                        day_number: task.day_number,
                        type: task.type,
                        title: task.title,
                        short_guide: task.short_guide,
                        detailed_content: task.detailed_content || "Content from template...",
                        learning_objectives: task.learning_objectives || [],
                        why_this_matters: task.why_this_matters || "",
                        hands_on_exercise: task.hands_on_exercise || "",
                        success_criteria: task.success_criteria || []
                    });
                });
            });

            if (tasksToInsert.length > 0) {
                const { error: tasksError } = await supabase
                    .from('tasks')
                    .insert(tasksToInsert);

                if (tasksError) throw new Error(`Task creation failed: ${tasksError.message}`);
            }
        }

        return NextResponse.json({ success: true, goalId });

    } catch (error) {
        console.error('[API] Clone Template Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
