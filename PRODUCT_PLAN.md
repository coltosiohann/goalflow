# GoalFlow Product Plan (Detailed)

Purpose: Provide a clear, repeatable blueprint for making GoalFlow more useful.
Audience: Any agent or contributor working on product, UX, or roadmap logic.
Scope: Product behavior, UX flow, content quality, and iteration cadence.

------------------------------------------------------------------------------
1) Core Promise
------------------------------------------------------------------------------
- Help users achieve a real goal with focused, actionable learning.
- Replace “task spam” with meaningful progress and tangible outcomes.
- Personalize the experience without long, slow generation cycles.

------------------------------------------------------------------------------
2) Learning Model (How content should be generated)
------------------------------------------------------------------------------
- Use a rolling 7-day module instead of a full 30-90 day dump.
- Each day: 1-2 tasks max (learn + practice or learn + review).
- Weekly structure:
  - Day 1: Plan + Learn
  - Days 2-5: Learn + Practice (progressive difficulty)
  - Day 6: Practice + Mini-project checkpoint
  - Day 7: Review + quiz + reflection
- Mini-project across the week:
  - Day 2: Set scope
  - Day 3: Implement core
  - Day 4: Add features
  - Day 5: Polish or test
  - Day 6: Finalize
  - Day 7: Retrospective

------------------------------------------------------------------------------
3) Content Quality Rules
------------------------------------------------------------------------------
- No repeated titles or copy across the 7-day window.
- Detailed content: 250-350 words for the main learning task.
- Each task must include:
  - Learning objectives (2-4)
  - Why this matters (2-3 sentences)
  - Hands-on exercise (specific, short)
  - Success criteria (2-3 measurable checks)
- Resources:
  - 0-2 per task
  - Each resource must explain why it helps.
- Quizzes:
  - Only for review tasks.
  - 1 scenario-based question with 4 options.

------------------------------------------------------------------------------
4) UX Flow (User Experience)
------------------------------------------------------------------------------
- Goal creation creates:
  - A goal entry
  - Milestones outline
  - Week 1 tasks
- On the goal page:
  - Show completed tasks + progress bar
  - Show current week + upcoming days
  - “Generate Next Week” button
  - If no tasks exist for the upcoming week, prompt user to generate

------------------------------------------------------------------------------
5) Adaptation & Feedback Loop
------------------------------------------------------------------------------
- After each week:
  - Ask 2 quick questions:
    1) Difficulty: too easy / good / too hard
    2) Time: too short / good / too long
- Use feedback to adjust:
  - Task count per day
  - Word count
  - Practice intensity

------------------------------------------------------------------------------
6) Metrics That Matter
------------------------------------------------------------------------------
- Completion rate of tasks per week.
- Week-over-week retention (did user continue to week 2? 3?).
- Progress quality: did user complete mini-project?
- Time to generate a weekly module (should be < 15s).

------------------------------------------------------------------------------
7) Edge Cases & Safeguards
------------------------------------------------------------------------------
- If AI returns too few tasks:
  - Regenerate that week once.
- If AI repeats titles:
  - Regenerate with a “no repetition” prompt.
- If user has no time:
  - Offer a “lite mode” (1 task/day, shorter content).

------------------------------------------------------------------------------
8) Roadmap Phases
------------------------------------------------------------------------------
- Phase 1 (Now):
  - Weekly module generation
  - Basic progress tracking
  - Generate Next Week button
- Phase 2:
  - Difficulty feedback
  - Mini-project tracking
  - Better resource curation
- Phase 3:
  - Personalized pacing
  - Weekly summaries and insights
  - Social accountability (shareable progress)

------------------------------------------------------------------------------
9) Checklist for Any Future Change
------------------------------------------------------------------------------
- Does this change improve learning outcomes?
- Does it reduce repetition?
- Does it keep generation time reasonable?
- Does it keep tasks actionable and realistic?

------------------------------------------------------------------------------
10) Short Summary
------------------------------------------------------------------------------
Generate in weekly modules, keep tasks short but meaningful, use feedback to adapt,
and focus on outcomes instead of volume.
