"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { TopicInputStep } from "./TopicInputStep"
import { AssessmentStep } from "./AssessmentStep"
import { ResultStep } from "./ResultStep"
import { CustomizeStep } from "./CustomizeStep"
import { toast } from "sonner"
import { Sparkles, GraduationCap } from "lucide-react"

export function GoalWizardContainer() {
    const router = useRouter()

    // -- State --
    const [step, setStep] = useState<'topic' | 'assessment' | 'result' | 'customize'>('topic')
    const [topic, setTopic] = useState("")
    const [level, setLevel] = useState("Novice")
    const [score, setScore] = useState(0)
    const [timeframe, setTimeframe] = useState(30)
    const [loading, setLoading] = useState(false)

    // -- Handlers --

    const handleAssessmentComplete = (finalScore: number, finalLevel: string) => {
        setScore(finalScore)
        setLevel(finalLevel)
        setStep('result') // Go to result screen first
        toast.success("Assessment Complete!")
    }

    // ... (handleGenerate remains same)

    const handleGenerate = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/generate-roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    goal: topic,
                    timeframe_days: timeframe,
                    level: level // Pass the assessed level!
                }),
            })

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error("Please login to save your goal.")
                    router.push("/login")
                    return
                }
                throw new Error('Failed to generate')
            }

            toast.success("Roadmap Generated!")
            router.push("/dashboard")
            router.refresh()
        } catch (e) {
            toast.error("Something went wrong. Please try again.")
            setLoading(false)
        }
    }

    // -- Render --
    return (
        <div className="w-full max-w-xl mx-auto space-y-8">

            {/* Wizard Header */}
            <div className="text-center">
                {step !== 'topic' && (
                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                        <span className="opacity-70">Goal:</span> {topic}
                    </div>
                )}
            </div>

            <Card className="glass-card shadow-2xl shadow-indigo-500/10 border-white/20">
                <CardContent className="p-8 min-h-[400px] flex flex-col justify-center">
                    {step === 'topic' && (
                        <TopicInputStep
                            topic={topic}
                            setTopic={setTopic}
                            onNext={() => setStep('assessment')}
                        />
                    )}

                    {step === 'assessment' && (
                        <AssessmentStep
                            topic={topic}
                            onComplete={handleAssessmentComplete}
                        />
                    )}

                    {step === 'result' && (
                        <ResultStep
                            level={level}
                            score={score}
                            onContinue={() => setStep('customize')}
                        />
                    )}

                    {step === 'customize' && (
                        <div className="space-y-6">
                            <CustomizeStep
                                timeframe={timeframe}
                                setTimeframe={setTimeframe}
                                onGenerate={handleGenerate}
                                loading={loading}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Step Indicator */}
            <div className="flex justify-center gap-2">
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 'topic' ? 'bg-indigo-600' : 'bg-neutral-200'}`} />
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 'assessment' ? 'bg-indigo-600' : 'bg-neutral-200'}`} />
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 'result' ? 'bg-indigo-600' : 'bg-neutral-200'}`} />
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 'customize' ? 'bg-indigo-600' : 'bg-neutral-200'}`} />
            </div>
        </div>
    )
}
