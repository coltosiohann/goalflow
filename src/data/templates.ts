import { Code2, Dumbbell, Globe2, Palette, Brain, Trophy, Briefcase, Music } from "lucide-react";

export type TemplateTask = {
    day_number: number;
    type: 'plan' | 'learn' | 'practice' | 'review' | 'quiz' | 'boss_battle';
    title: string;
    short_guide: string;
    learning_objectives?: string[];
    why_this_matters?: string;
    detailed_content?: string;
    hands_on_exercise?: string;
    success_criteria?: string[];
    video_url?: string;
    xp_reward?: number;
    json_content?: any;
};

export type TemplateMilestone = {
    title: string;
    day_start: number;
    day_end: number;
    tasks: TemplateTask[];
};

export type Template = {
    id: string;
    title: string;
    description: string;
    category: "Tech" | "Fitness" | "Language" | "Creative" | "Lifestyle" | "Business";
    duration: number; // days
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    icon: any;
    usersCount?: string;
    tags: string[];
    milestones: TemplateMilestone[];
};

export const templates: Template[] = [
    {
        id: "fullstack-dev-2024",
        title: "Fullstack Developer 2024",
        description: "Master React, Node.js, and Database fundamentals to build modern web apps.",
        category: "Tech",
        duration: 90,
        difficulty: "Advanced",
        icon: Code2,
        usersCount: "12k+",
        tags: ["React", "Next.js", "Node.js"],
        milestones: [
            {
                title: "Foundations of Web",
                day_start: 1,
                day_end: 14,
                tasks: [
                    {
                        day_number: 1,
                        type: "plan",
                        title: "Setting Up Your Dev Environment",
                        short_guide: "Install VS Code, Node.js, and Git to get ready for coding.",
                        learning_objectives: ["Install Node.js & NPM", "Setup VS Code extensions", "Initialize a Git repo"],
                        why_this_matters: "A clean, powerful environment is the workshop of every great developer.",
                        detailed_content: "Welcome to your Fullstack journey! Today is about preparation. You will install the necessary tools...",
                        hands_on_exercise: "Create a 'Hello World' file and push it to GitHub.",
                        success_criteria: ["Node -v returns a version", "Git push successful"],
                    },
                    {
                        day_number: 2,
                        type: "learn",
                        title: "HTML5 Semantic Structure",
                        short_guide: "Understand modern HTML tags like <header>, <main>, and <article>.",
                    },
                    {
                        day_number: 5,
                        type: "practice",
                        title: "Build a Personal Portfolio Layout",
                        short_guide: "Use Flexbox and Grid to create a responsive landing page.",
                    }
                ]
            },
            {
                title: "React & Modern UI",
                day_start: 15,
                day_end: 45,
                tasks: [
                    {
                        day_number: 15,
                        type: "learn",
                        title: "Introduction to React Components",
                        short_guide: "Thinking in components: Props, State, and JSX basics.",
                    },
                    {
                        day_number: 20,
                        type: "practice",
                        title: "Interactive To-Do List",
                        short_guide: "Build a CRUD app using React useState and useEffect.",
                    }
                ]
            },
            {
                title: "Backend & Database",
                day_start: 46,
                day_end: 90,
                tasks: [
                    {
                        day_number: 46,
                        type: "learn",
                        title: "Node.js & Express Basics",
                        short_guide: "Creating your first API server with Express.",
                    }
                ]
            }
        ]
    },
    {
        id: "couch-to-5k",
        title: "Couch to 5K Runner",
        description: "A gentle progression plan to get you running 5 kilometers in just 8 weeks.",
        category: "Fitness",
        duration: 60,
        difficulty: "Beginner",
        icon: Dumbbell,
        usersCount: "25k+",
        tags: ["Running", "Health", "Cardio"],
        milestones: [
            {
                title: "Building the Habit",
                day_start: 1,
                day_end: 14,
                tasks: [
                    {
                        day_number: 1,
                        type: "plan",
                        title: "Gear & Goal Setting",
                        short_guide: "Get the right shoes and schedule your run times.",
                    },
                    {
                        day_number: 2,
                        type: "practice",
                        title: "The First Run-Walk",
                        short_guide: "Run 1 min, Walk 2 mins. Repeat 8 times.",
                    }
                ]
            },
            {
                title: "Increasing Endurance",
                day_start: 15,
                day_end: 40,
                tasks: [
                    {
                        day_number: 15,
                        type: "practice",
                        title: "Non-stop 5 Minute Run",
                        short_guide: "Pushing past the mental barrier.",
                    }
                ]
            },
            {
                title: "Race Ready",
                day_start: 41,
                day_end: 60,
                tasks: [
                    {
                        day_number: 60,
                        type: "review",
                        title: "The 5K Run",
                        short_guide: "Today is the day! Run your full 5km distance.",
                    }
                ]
            }
        ]
    },
    {
        id: "spanish-basics",
        title: "Spanish Conversation Basics",
        description: "Learn essential vocabulary and grammar to hold your first real conversation.",
        category: "Language",
        duration: 30,
        difficulty: "Beginner",
        icon: Globe2,
        usersCount: "8k+",
        tags: ["Spanish", "Travel", "Speaking"],
        milestones: [
            {
                title: "The Sounds of Spanish",
                day_start: 1,
                day_end: 7,
                tasks: [
                    {
                        day_number: 1,
                        type: "learn",
                        title: "The Alphabet & Pronunciation",
                        short_guide: "Master the vowel sounds (a, e, i, o, u).",
                    },
                    {
                        day_number: 3,
                        type: "practice",
                        title: "Greetings & Introductions",
                        short_guide: "Practice saying 'Hola, me llamo...'",
                    }
                ]
            },
            {
                title: "Core Vocabulary",
                day_start: 8,
                day_end: 20,
                tasks: [
                    {
                        day_number: 8,
                        type: "learn",
                        title: "Numbers 1-100",
                        short_guide: "Counting is essential for shopping and time.",
                    },
                    {
                        day_number: 15,
                        type: "learn",
                        title: "Essential Verbs: Ser vs Estar",
                        short_guide: "The two pillars of 'To Be' in Spanish.",
                    }
                ]
            },
            {
                title: "First Conversations",
                day_start: 21,
                day_end: 30,
                tasks: [
                    {
                        day_number: 25,
                        type: "practice",
                        title: "Ordering Food",
                        short_guide: "Roleplay ordering a meal in a restaurant.",
                    },
                    {
                        day_number: 30,
                        type: "review",
                        title: "Full Conversation Challenge",
                        short_guide: "Record yourself having a 2-min convo.",
                    }
                ]
            }
        ]
    },
    {
        id: "digital-art-mastery",
        title: "Digital Art Fundamentals",
        description: "From sketching to coloring: master the basics of digital illustration.",
        category: "Creative",
        duration: 45,
        difficulty: "Intermediate",
        icon: Palette,
        usersCount: "5k+",
        tags: ["Drawing", "Design", "Color Theory"],
        milestones: [
            {
                title: "Tools of the Trade",
                day_start: 1,
                day_end: 10,
                tasks: [
                    {
                        day_number: 1,
                        type: "plan",
                        title: "Software Setup",
                        short_guide: "Configure your tablet and brush settings.",
                    },
                    {
                        day_number: 3,
                        type: "practice",
                        title: "Line Control",
                        short_guide: "Practice smooth lines and confident strokes.",
                    }
                ]
            },
            {
                title: "Shape & Form",
                day_start: 11,
                day_end: 25,
                tasks: [
                    {
                        day_number: 11,
                        type: "learn",
                        title: "Breaking Down Objects",
                        short_guide: "See the world in cubes, spheres, and cylinders.",
                    },
                    {
                        day_number: 18,
                        type: "practice",
                        title: "Shading & Light",
                        short_guide: "Render a sphere with core shadow and highlight.",
                    }
                ]
            },
            {
                title: "Color & Composition",
                day_start: 26,
                day_end: 45,
                tasks: [
                    {
                        day_number: 26,
                        type: "learn",
                        title: "Color Theory 101",
                        short_guide: "Complementary, Analogous, and Triadic schemes.",
                    },
                    {
                        day_number: 45,
                        type: "review",
                        title: "Final Illustration",
                        short_guide: "Create a complete character or environment piece.",
                    }
                ]
            }
        ]
    },
    {
        id: "meditation-habit",
        title: "Mindfulness & Meditation",
        description: "Build a solid daily meditation habit to reduce stress and improve focus.",
        category: "Lifestyle",
        duration: 21,
        difficulty: "Beginner",
        icon: Brain,
        usersCount: "15k+",
        tags: ["Mental Health", "Focus", "Habit"],
        milestones: [
            {
                title: "The Breath",
                day_start: 1,
                day_end: 7,
                tasks: [
                    {
                        day_number: 1,
                        type: "practice",
                        title: "3 Minutes of Breath",
                        short_guide: "Just focus on the sensation of breathing.",
                    },
                    {
                        day_number: 5,
                        type: "learn",
                        title: "Handling Distractions",
                        short_guide: "What to do when the mind wanders.",
                    }
                ]
            },
            {
                title: "Body Awareness",
                day_start: 8,
                day_end: 14,
                tasks: [
                    {
                        day_number: 8,
                        type: "practice",
                        title: "Body Scan Technique",
                        short_guide: "Progressive relaxation from toe to head.",
                    }
                ]
            },
            {
                title: "Daily Integration",
                day_start: 15,
                day_end: 21,
                tasks: [
                    {
                        day_number: 21,
                        type: "review",
                        title: "The 20-Minute Sit",
                        short_guide: "A longer, unguided session to solidify the habit.",
                    }
                ]
            }
        ]
    },
    {
        id: "startup-launch",
        title: "Launch Your Startup",
        description: "Go from idea to MVP launch with this structured business roadmap.",
        category: "Business",
        duration: 90,
        difficulty: "Advanced",
        icon: Trophy,
        usersCount: "3k+",
        tags: ["Business", "Product", "Strategy"],
        milestones: [
            {
                title: "Validation",
                day_start: 1,
                day_end: 30,
                tasks: [
                    {
                        day_number: 1,
                        type: "plan",
                        title: "Problem Statement",
                        short_guide: "Define clearly what painful problem you are solving.",
                    },
                    {
                        day_number: 10,
                        type: "practice",
                        title: "Customer Interviews",
                        short_guide: "Talk to 10 potential users. Do not pitch, just listen.",
                    }
                ]
            },
            {
                title: "Build (MVP)",
                day_start: 31,
                day_end: 60,
                tasks: [
                    {
                        day_number: 31,
                        type: "plan",
                        title: "Feature Prioritization",
                        short_guide: "What is the absolute minimum feature set?",
                    },
                    {
                        day_number: 50,
                        type: "practice",
                        title: "Landing Page Launch",
                        short_guide: "Collect emails before code is finished.",
                    }
                ]
            },
            {
                title: "Launch & Growth",
                day_start: 61,
                day_end: 90,
                tasks: [
                    {
                        day_number: 61,
                        type: "learn",
                        title: "Go-To-Market Strategy",
                        short_guide: "Where do your users hang out?",
                    },
                    {
                        day_number: 90,
                        type: "review",
                        title: "Product Hunt Launch",
                        short_guide: "Prepare your assets and launch to the world.",
                    }
                ]
            }
        ]
    }
];
