-- Add enhanced content fields to tasks table

ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS learning_objectives TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS why_this_matters TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS detailed_content TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS hands_on_exercise TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS success_criteria TEXT[] DEFAULT '{}';

-- Add resource_description to resources table
ALTER TABLE resources
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
