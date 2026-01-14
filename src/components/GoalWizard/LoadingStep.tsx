"use client"
import { useState, useEffect } from "react"
import { Loader2, Sparkles, Brain, Search, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingStepProps {
    topic: string
}

const MESSAGES = [
    { text: "Analyzing the domain of", icon: Search },
    { text: "Consulting curriculum standards...", icon: Brain },
    { text: "Identifying key concepts...", icon: Lightbulb },
    { text: "Drafting challenge questions...", icon: Sparkles },
]

export function LoadingStep({ topic }: LoadingStepProps) {
    const [msgIndex, setMsgIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % MESSAGES.length)
        }, 1500)
        return () => clearInterval(interval)
    }, [])

    const CurrentIcon = MESSAGES[msgIndex].icon

    return (
        <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full" />
                <div className="relative bg-white drop-shadow-xl p-6 rounded-2xl border border-indigo-50">
                    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={msgIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center gap-3"
                >
                    <div className="flex items-center gap-2 text-indigo-600 font-medium bg-indigo-50 px-4 py-1.5 rounded-full text-sm">
                        <CurrentIcon className="h-4 w-4" />
                        <span>AI Processing</span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800 text-center max-w-[300px]">
                        {MESSAGES[msgIndex].text} {msgIndex === 0 && <span className="text-indigo-600">"{topic}"</span>}
                    </h3>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
