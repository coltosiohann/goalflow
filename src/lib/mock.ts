// Mock data for GoalFlow - No backend or AI yet

export type TaskType = "plan" | "learn" | "practice" | "review";

export type Goal = {
  id: string;
  title: string;
  timeframeDays: number;
  status: "active" | "completed" | "paused";
  createdAt: string;
};

export type Milestone = {
  id: string;
  goalId: string;
  title: string;
  dayStart: number;
  dayEnd: number;
};

export type Task = {
  id: string;
  goalId: string;
  milestoneId: string;
  dayNumber: number;
  type: TaskType;
  title: string;
  shortGuide: string;
  videoUrl?: string; // YouTube embed URL
  resources: Resource[];
  quiz: QuizQuestion[]; // Knowledge check quiz
};

export type Resource = {
  label: string;
  url: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
};

export type QuizResult = {
  taskId: string;
  score: number; // percentage
  answers: number[]; // user's answers (indices)
  completedAt: string;
};

export type Progress = {
  taskId: string;
  completed: boolean;
  completedAt?: string;
  quizResult?: QuizResult;
};

// Sample goal: "Learn Python in 30 days"
export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    title: "Learn Python in 30 days",
    timeframeDays: 30,
    status: "active",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
];

export const mockMilestones: Milestone[] = [
  {
    id: "milestone-1",
    goalId: "goal-1",
    title: "Python Fundamentals",
    dayStart: 1,
    dayEnd: 5,
  },
  {
    id: "milestone-2",
    goalId: "goal-1",
    title: "Data Structures & Control Flow",
    dayStart: 6,
    dayEnd: 10,
  },
  {
    id: "milestone-3",
    goalId: "goal-1",
    title: "Functions & Modules",
    dayStart: 11,
    dayEnd: 15,
  },
  {
    id: "milestone-4",
    goalId: "goal-1",
    title: "Object-Oriented Programming",
    dayStart: 16,
    dayEnd: 20,
  },
  {
    id: "milestone-5",
    goalId: "goal-1",
    title: "File Handling & Error Management",
    dayStart: 21,
    dayEnd: 25,
  },
  {
    id: "milestone-6",
    goalId: "goal-1",
    title: "Final Project & Review",
    dayStart: 26,
    dayEnd: 30,
  },
];

export const mockTasks: Task[] = [
  // Milestone 1: Python Fundamentals (Days 1-5)
  {
    id: "task-1",
    goalId: "goal-1",
    milestoneId: "milestone-1",
    dayNumber: 1,
    type: "learn",
    title: "Python Syntax & Variables",
    shortGuide:
      "Start your Python journey by understanding the basic syntax and how to work with variables. Learn about different data types (strings, integers, floats, booleans) and how Python handles variable assignment. Practice declaring variables, understanding Python's dynamic typing, and exploring basic operations. This foundation is crucial for everything that follows.",
    resources: [
      { label: "Python.org Official Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "Real Python - Variables", url: "https://realpython.com/python-variables/" },
      { label: "W3Schools Python Intro", url: "https://www.w3schools.com/python/" },
    ],
    quiz: [], // Completed task - no quiz needed
  },
  {
    id: "task-2",
    goalId: "goal-1",
    milestoneId: "milestone-1",
    dayNumber: 2,
    type: "practice",
    title: "Practice Basic Operations",
    shortGuide:
      "Solidify your understanding by writing actual Python code. Create a simple program that uses variables, performs arithmetic operations, and combines strings. Try creating a calculator that adds, subtracts, multiplies, and divides numbers. Experiment with string concatenation and formatting. The more you type, the more comfortable you'll become with Python's syntax.",
    resources: [
      { label: "Python Exercises - Basic", url: "https://www.w3resource.com/python-exercises/" },
      { label: "Codewars Python Kata", url: "https://www.codewars.com/" },
    ],
    quiz: [],
  },
  {
    id: "task-3",
    goalId: "goal-1",
    milestoneId: "milestone-1",
    dayNumber: 3,
    type: "learn",
    title: "Input/Output & Comments",
    shortGuide:
      "Learn how to make your programs interactive by accepting user input and displaying output. Understand the input() function and how to convert user input to different data types. Master print() function formatting and learn best practices for writing clear, helpful comments in your code. Good commenting habits start now and will serve you throughout your programming career.",
    resources: [
      { label: "Python I/O Tutorial", url: "https://realpython.com/python-input-output/" },
      { label: "Commenting Best Practices", url: "https://realpython.com/python-comments-guide/" },
    ],
    quiz: [],
  },
  {
    id: "task-4",
    goalId: "goal-1",
    milestoneId: "milestone-1",
    dayNumber: 7,
    type: "learn",
    title: "Lists & Tuples",
    shortGuide:
      "Dive into Python's powerful data structures, starting with lists and tuples. Learn how to create, access, modify, and iterate over lists. Understand the difference between mutable lists and immutable tuples, and when to use each. Practice common list operations like appending, removing, slicing, and sorting. These structures are fundamental to almost every Python program you'll write.",
    resources: [
      { label: "Python Lists Guide", url: "https://realpython.com/python-lists-tuples/" },
      { label: "List Methods Reference", url: "https://docs.python.org/3/tutorial/datastructures.html" },
    ],
    quiz: [],
  },
  {
    id: "task-5",
    goalId: "goal-1",
    milestoneId: "milestone-2",
    dayNumber: 8,
    type: "learn",
    title: "Dictionaries & Sets",
    shortGuide:
      "Expand your data structure knowledge with dictionaries (key-value pairs) and sets (unique collections). Understand how to create, access, and modify dictionaries. Learn about dictionary methods and when dictionaries are more efficient than lists. Explore sets and their mathematical operations. These structures are essential for organizing and manipulating data efficiently in real-world applications.",
    resources: [
      { label: "Python Dictionaries", url: "https://realpython.com/python-dicts/" },
      { label: "Working with Sets", url: "https://realpython.com/python-sets/" },
    ],
    quiz: [],
  },
  {
    id: "task-6",
    goalId: "goal-1",
    milestoneId: "milestone-2",
    dayNumber: 9,
    type: "learn",
    title: "Conditional Statements",
    shortGuide:
      "Learn to make your programs make decisions using if, elif, and else statements. Understand comparison operators and logical operators (and, or, not). Practice writing complex conditional logic and understand Python's truthiness concept. Master indentation rules, which are crucial in Python. Conditional statements are the foundation of program flow control.",
    resources: [
      { label: "Conditional Statements Guide", url: "https://realpython.com/python-conditional-statements/" },
      { label: "Python Operators", url: "https://www.w3schools.com/python/python_operators.asp" },
    ],
    quiz: [],
  },
  {
    id: "task-7",
    goalId: "goal-1",
    milestoneId: "milestone-2",
    dayNumber: 10,
    type: "practice",
    title: "Build a Simple Quiz App",
    videoUrl: "https://www.youtube.com/embed/8ext9G7xspg",
    shortGuide:
      "Apply everything you've learned so far by building a simple quiz application. Use lists to store questions and answers, dictionaries to track scores, conditional statements to check answers, and loops to iterate through questions. This project combines multiple concepts and gives you practical experience. Make it interactive and fun - add features like score tracking and feedback messages!",
    resources: [
      { label: "Project Ideas", url: "https://realpython.com/python-projects-beginners/" },
      { label: "Building Python Apps", url: "https://automatetheboringstuff.com/" },
    ],
    quiz: [
      {
        id: "q1",
        question: "What data structure is best for storing a collection of quiz questions in order?",
        options: ["Dictionary", "List", "Set", "Tuple"],
        correctAnswer: 1,
        explanation: "Lists are perfect for storing ordered collections of items like quiz questions."
      },
      {
        id: "q2",
        question: "Which operator would you use to check if a user's answer matches the correct answer?",
        options: ["=", "==", "!=", "is"],
        correctAnswer: 1,
        explanation: "The == operator compares two values for equality."
      },
      {
        id: "q3",
        question: "How do you iterate through a list of questions in Python?",
        options: ["while loop", "for loop", "if statement", "switch statement"],
        correctAnswer: 1,
        explanation: "A for loop is the most common way to iterate through a list in Python."
      },
      {
        id: "q4",
        question: "What should you use to track the user's score?",
        options: ["List", "String", "Integer variable", "Boolean"],
        correctAnswer: 2,
        explanation: "An integer variable can store and increment the score as users answer correctly."
      },
      {
        id: "q5",
        question: "Which statement allows you to execute code only if a condition is true?",
        options: ["for", "while", "if", "def"],
        correctAnswer: 2,
        explanation: "The if statement executes code conditionally based on whether a condition is true."
      },
    ],
  },
  {
    id: "task-8",
    goalId: "goal-1",
    milestoneId: "milestone-3",
    dayNumber: 14,
    type: "learn",
    title: "Functions & Parameters",
    shortGuide:
      "Master the art of writing reusable code with functions. Learn how to define functions, pass parameters, return values, and understand scope. Explore default parameters, keyword arguments, and *args/**kwargs. Functions are essential for organizing code, reducing repetition, and making your programs more maintainable. Practice writing pure functions and understanding the DRY principle.",
    resources: [
      { label: "Python Functions Guide", url: "https://realpython.com/defining-your-own-python-function/" },
      { label: "Function Best Practices", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" },
    ],
    quiz: [],
  },
  {
    id: "task-9",
    goalId: "goal-1",
    milestoneId: "milestone-4",
    dayNumber: 18,
    type: "learn",
    title: "Classes & Objects",
    shortGuide:
      "Enter the world of Object-Oriented Programming (OOP) by learning about classes and objects. Understand the concepts of encapsulation, attributes, and methods. Learn how to create class instances, use the __init__ constructor, and work with self. OOP is a fundamental paradigm in Python that helps you model real-world entities and create more organized, scalable code.",
    resources: [
      { label: "Python OOP Tutorial", url: "https://realpython.com/python3-object-oriented-programming/" },
      { label: "Classes Documentation", url: "https://docs.python.org/3/tutorial/classes.html" },
    ],
    quiz: [],
  },
  {
    id: "task-10",
    goalId: "goal-1",
    milestoneId: "milestone-5",
    dayNumber: 23,
    type: "review",
    title: "Error Handling & Exceptions",
    shortGuide:
      "Learn to write robust programs that handle errors gracefully using try-except blocks. Understand different types of exceptions, how to catch specific exceptions, and when to use finally clauses. Practice raising custom exceptions and learn best practices for error handling. Professional programs anticipate and handle errors rather than crashing - this skill separates beginner code from production-ready applications.",
    resources: [
      { label: "Exception Handling", url: "https://realpython.com/python-exceptions/" },
      { label: "Error Types Reference", url: "https://docs.python.org/3/library/exceptions.html" },
    ],
    quiz: [],
  },
];

// Mock progress - some tasks completed
export const mockProgress: Progress[] = [
  {
    taskId: "task-1",
    completed: true,
    completedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    taskId: "task-2",
    completed: true,
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    taskId: "task-3",
    completed: true,
    completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    taskId: "task-4",
    completed: true,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    taskId: "task-5",
    completed: true,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    taskId: "task-6",
    completed: true,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // task-7 is today's task (not completed yet)
];

// Utility functions
export function getCurrentDayNumber(goal: Goal): number {
  const startDate = new Date(goal.createdAt);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays, goal.timeframeDays);
}

export function getTodaysTasks(goalId: string): Task[] {
  const goal = mockGoals.find((g) => g.id === goalId);
  if (!goal) return [];

  const currentDay = getCurrentDayNumber(goal);
  return mockTasks.filter(
    (task) => task.goalId === goalId && task.dayNumber === currentDay
  );
}

export function getTaskProgress(taskId: string): Progress | undefined {
  return mockProgress.find((p) => p.taskId === taskId);
}

export function getGoalProgress(goalId: string): number {
  const goalTasks = mockTasks.filter((t) => t.goalId === goalId);
  if (goalTasks.length === 0) return 0;

  const completedTasks = goalTasks.filter((t) =>
    mockProgress.some((p) => p.taskId === t.id && p.completed)
  );

  return Math.round((completedTasks.length / goalTasks.length) * 100);
}

export function getMilestoneProgress(milestoneId: string): number {
  const milestoneTasks = mockTasks.filter((t) => t.milestoneId === milestoneId);
  if (milestoneTasks.length === 0) return 0;

  const completedTasks = milestoneTasks.filter((t) =>
    mockProgress.some((p) => p.taskId === t.id && p.completed)
  );

  return Math.round((completedTasks.length / milestoneTasks.length) * 100);
}

export function getStreak(): number {
  // Mock streak calculation - in real app would check consecutive days
  return 7; // 7 day streak
}

export function completeTask(taskId: string, quizScore?: number, quizAnswers?: number[]): void {
  // Check if task already has progress
  const existingProgress = mockProgress.find((p) => p.taskId === taskId);

  if (existingProgress) {
    // Update existing progress
    existingProgress.completed = true;
    existingProgress.completedAt = new Date().toISOString();
    if (quizScore !== undefined) {
      existingProgress.quizResult = {
        score: quizScore,
        answers: quizAnswers || [],
        attemptedAt: new Date().toISOString(),
      };
    }
  } else {
    // Add new progress entry
    mockProgress.push({
      taskId,
      completed: true,
      completedAt: new Date().toISOString(),
      quizResult: quizScore !== undefined ? {
        score: quizScore,
        answers: quizAnswers || [],
        attemptedAt: new Date().toISOString(),
      } : undefined,
    });
  }
}
