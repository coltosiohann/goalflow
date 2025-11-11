-- This file contains sample data for testing
-- You can run this after creating your first user account
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users table

-- Example: First, get your user ID by running:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Then replace 'YOUR_USER_ID' below with the UUID you got

-- NOTE: This is optional - you can also create goals through the UI once it's built
-- This is just for quick testing

/*
-- Example seed data (uncomment and replace YOUR_USER_ID to use):

-- Insert a sample goal
INSERT INTO goals (id, user_id, title, timeframe_days, status, created_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  'YOUR_USER_ID'::uuid,
  'Learn Python in 30 days',
  30,
  'active',
  NOW() - INTERVAL '10 days'
);

-- Insert milestones
INSERT INTO milestones (goal_id, title, day_start, day_end, order_index) VALUES
('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Python Fundamentals', 1, 5, 1),
('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Data Structures & Algorithms', 6, 15, 2),
('550e8400-e29b-41d4-a716-446655440000'::uuid, 'Build Real Projects', 16, 30, 3);

-- Insert sample tasks
INSERT INTO tasks (goal_id, milestone_id, day_number, type, title, short_guide, video_url, quiz)
SELECT
  '550e8400-e29b-41d4-a716-446655440000'::uuid,
  (SELECT id FROM milestones WHERE goal_id = '550e8400-e29b-41d4-a716-446655440000'::uuid AND title = 'Data Structures & Algorithms'),
  10,
  'practice',
  'Build a Simple Quiz App',
  'Apply everything you''ve learned so far by building a simple quiz application. Use lists to store questions and answers, dictionaries to track scores, conditional statements to check answers, and loops to iterate through questions. This project combines multiple concepts and gives you practical experience. Make it interactive and fun - add features like score tracking and feedback messages!',
  'https://www.youtube.com/embed/8ext9G7xspg',
  '[
    {
      "id": "q1",
      "question": "What data structure is best for storing a collection of quiz questions in order?",
      "options": ["Dictionary", "List", "Set", "Tuple"],
      "correctAnswer": 1,
      "explanation": "Lists are perfect for storing ordered collections of items like quiz questions."
    },
    {
      "id": "q2",
      "question": "Which operator would you use to check if a user''s answer matches the correct answer?",
      "options": ["=", "==", "!=", "is"],
      "correctAnswer": 1,
      "explanation": "The == operator compares two values for equality."
    },
    {
      "id": "q3",
      "question": "How do you iterate through a list of questions in Python?",
      "options": ["while loop", "for loop", "if statement", "switch statement"],
      "correctAnswer": 1,
      "explanation": "A for loop is the most common way to iterate through a list in Python."
    },
    {
      "id": "q4",
      "question": "What should you use to track the user''s score?",
      "options": ["List", "String", "Integer variable", "Boolean"],
      "correctAnswer": 2,
      "explanation": "An integer variable can store and increment the score as users answer correctly."
    },
    {
      "id": "q5",
      "question": "Which statement allows you to execute code only if a condition is true?",
      "options": ["for", "while", "if", "def"],
      "correctAnswer": 2,
      "explanation": "The if statement executes code conditionally based on whether a condition is true."
    }
  ]'::jsonb;

-- Insert sample resources for the task
INSERT INTO resources (task_id, label, url, order_index)
SELECT
  id,
  'Project Ideas',
  'https://realpython.com/python-projects-beginners/',
  1
FROM tasks WHERE title = 'Build a Simple Quiz App'
UNION ALL
SELECT
  id,
  'Building Python Apps',
  'https://automatetheboringstuff.com/',
  2
FROM tasks WHERE title = 'Build a Simple Quiz App';

*/

-- Instructions:
-- 1. Create your Supabase account at https://supabase.com
-- 2. Create a new project
-- 3. Go to SQL Editor
-- 4. Run migration 001_initial_schema.sql first
-- 5. Sign up for an account in your app
-- 6. Get your user ID: SELECT id FROM auth.users WHERE email = 'your-email@example.com';
-- 7. Uncomment the code above and replace 'YOUR_USER_ID' with your actual UUID
-- 8. Run this seed data

-- Alternatively, you can create goals through the UI once authentication is set up!
