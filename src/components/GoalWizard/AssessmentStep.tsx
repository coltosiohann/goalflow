"use client"
import { useState, useEffect } from "react"
import { LoadingStep } from "./LoadingStep"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Match the type from our API
type Question = {
    id: string
    question: string
    options: string[]
    correctAnswer: number
    difficulty: string
    explanation: string
}

interface AssessmentStepProps {
    topic: string
    onComplete: (score: number, level: string) => void
}

export function AssessmentStep({ topic, onComplete }: AssessmentStepProps) {
    const [loading, setLoading] = useState(true)
    const [questions, setQuestions] = useState<Question[]>([])
    const [currentQIndex, setCurrentQIndex] = useState(0)
    const [answers, setAnswers] = useState<number[]>([]) // Store user's selected indices
    const [showExplanation, setShowExplanation] = useState(false)
    const [score, setScore] = useState(0)

    // Fetch questions on mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch('/api/generate-assessment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ topic })
                })
                const data = await res.json()
                if (data.questions) {
                    setQuestions(data.questions)
                } else {
                    // Fallback if API fails or quota exceeded (simulated)
                    setQuestions([
                        {
                            id: 'fallback-1',
                            question: `How would you rate your experience with ${topic}?`,
                            options: ["Complete Beginner", "I know the basics", "I've built some projects", "I'm an expert"],
                            correctAnswer: 3, // Logic will treat self-report differently, but for now we map 0->Novice, 1->Novice, 2->Int, 3->Expert logic
                            difficulty: 'self-report',
                            explanation: "Self-assessment helps us start you at the right place."
                        }
                    ])
                }
            } catch (err) {
                console.error("Failed to load assessment", err)
            } finally {
                setLoading(false)
            }
        }
        fetchQuestions()
    }, [topic])

    const handleAnswer = (optionIndex: number) => {
        if (showExplanation) return // Prevent clicking during explanation

        const currentQuestion = questions[currentQIndex]

        // Check if it's a self-report question (simulated fallback)
        if (currentQuestion.difficulty === 'self-report') {
            // Direct mapping: 0=Novice, 1=Novice, 2=Intermediate, 3=Expert
            let level = 'Novice'
            if (optionIndex === 2) level = 'Intermediate'
            if (optionIndex === 3) level = 'Expert'

            // Calc simulated score (0, 2, 3)
            const simScore = optionIndex
            onComplete(simScore, level)
            return
        }

        // Normal Quiz Logic
        const isCorrect = optionIndex === currentQuestion.correctAnswer
        if (isCorrect) setScore(s => s + 1)

        // Save answer
        const newAnswers = [...answers]
        newAnswers[currentQIndex] = optionIndex
        setAnswers(newAnswers)

        // Show feedback
        setShowExplanation(true)
    }

    const handleNext = () => {
        setShowExplanation(false)
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(prev => prev + 1)
        } else {
            // Finished
            // Calculate final level based on score (out of 3)
            let finalLevel = 'Novice'
            if (score === 2) finalLevel = 'Intermediate'
            if (score === 3) finalLevel = 'Expert'

            // Edge case: if they got the hard one right but easy wrong? 
            // Simple score tracking is usually fine for MVP.
            onComplete(score, finalLevel)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in">
                <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                <p className="text-muted-foreground text-center">
                    Consulting the AI Examiner...<br />
                    <span className="text-xs opacity-70">Generating unique questions for "{topic}"</span>
                </p>
            </div>
        )
    }

    const currentQ = questions[currentQIndex]

    return (
        <div className="space-y-6 max-w-lg mx-auto">
            {/* Progress Bar */}
            <div className="h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                <div
                    className="h-full bg-indigo-600 transition-all duration-500"
                    style={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
                />
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                        Question {currentQIndex + 1} of {questions.length}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                        {currentQ.difficulty !== 'self-report' && currentQ.difficulty}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-neutral-900 leading-relaxed">
                    {currentQ.question}
                </h3>

                <div className="grid gap-3 pt-2">
                    {currentQ.options.map((option, idx) => {
                        const isSelected = answers[currentQIndex] === idx
                        const isCorrect = currentQ.correctAnswer === idx

                        // Visual state logic
                        let variant = "outline"
                        let className = "text-left text-base p-4 h-auto justify-start border-2 hover:border-indigo-200 hover:bg-indigo-50"

                        if (showExplanation) {
                            if (isCorrect) {
                                className = "text-left text-base p-4 h-auto justify-start border-2 border-green-500 bg-green-50 text-green-900 opacity-100"
                            } else if (isSelected && !isCorrect) {
                                className = "text-left text-base p-4 h-auto justify-start border-2 border-red-500 bg-red-50 text-red-900 opacity-100"
                            } else {
                                className += " opacity-50" // Dim other options
                            }
                        }

                        return (
                            <Button
                                key={idx}
                                variant="ghost"
                                className={cn("rounded-xl transition-all duration-200", className)}
                                onClick={() => handleAnswer(idx)}
                                disabled={showExplanation}
                            >
                                <span className="mr-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current opacity-50">
                                    {String.fromCharCode(65 + idx)}
                                </span>
                                {option}
                                {showExplanation && isCorrect && <CheckCircle2 className="ml-auto h-5 w-5 text-green-600" />}
                                {showExplanation && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-600" />}
                            </Button>
                        )
                    })}
                </div>
            </div>

            {/* Explanation / Next Button */}
            <AnimatePresence>
                {showExplanation && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl bg-indigo-50/50 p-4 space-y-4 border border-indigo-100"
                    >
                        <div className="flex gap-3">
                            <HelpCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-indigo-900 leading-relaxed">
                                {currentQ.explanation}
                            </p>
                        </div>
                        <Button onClick={handleNext} className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white">
                            {currentQIndex < questions.length - 1 ? "Next Question" : "See Results"}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
