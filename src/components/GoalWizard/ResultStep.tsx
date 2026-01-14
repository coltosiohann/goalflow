"use client"
import { Button } from "@/components/ui/button"
import { ArrowRight, Trophy, BookOpen, Star } from "lucide-react"

interface ResultStepProps {
    level: string
    score: number // out of 3
    onContinue: () => void
}

export function ResultStep({ level, score, onContinue }: ResultStepProps) {

    // Custom copy based on level
    const content = {
        Novice: {
            icon: BookOpen,
            color: "text-blue-600",
            bg: "bg-blue-100",
            title: "Foundation Builder",
            desc: "You're starting fresh! We'll build a solid foundation with core concepts before moving to complex topics."
        },
        Intermediate: {
            icon: Star,
            color: "text-orange-600",
            bg: "bg-orange-100",
            title: "Skill Sharpener",
            desc: "You've got the basics down. We've skipped the introductory chapters so you can focus on application."
        },
        Expert: {
            icon: Trophy,
            color: "text-purple-600",
            bg: "bg-purple-100",
            title: "Mastery Seeker",
            desc: "Impressive! We're fast-tracking you straight to advanced patterns, optimization, and complex projects."
        }
    }[level] || { icon: Star, color: "text-gray-600", bg: "bg-gray-100", title: "Learner", desc: "Ready to go!" }

    const Icon = content.icon

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center py-8">

            {/* Badge Animation */}
            <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                <div className={`absolute inset-0 ${content.bg} rounded-full opacity-20 animate-pulse`} />
                <div className={`h-24 w-24 rounded-full ${content.bg} flex items-center justify-center shadow-sm`}>
                    <Icon className={`h-12 w-12 ${content.color}`} />
                </div>

                {/* Only show stars for score > 0 */}
                {score > 0 && (
                    <div className="absolute -bottom-2 bg-white px-3 py-1 rounded-full shadow-md border border-gray-100 text-xs font-bold flex gap-1 items-center">
                        {Array(score).fill(0).map((_, i) => (
                            <span key={i}>⭐</span>
                        ))}
                    </div>
                )}
            </div>

            <div className="space-y-4 max-w-sm mx-auto">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{level}</h2>
                    <div className={`text-sm font-medium uppercase tracking-widest mt-1 ${content.color}`}>
                        {content.title}
                    </div>
                </div>

                <p className="text-neutral-600 leading-relaxed">
                    {content.desc}
                </p>
            </div>

            <Button
                onClick={onContinue}
                size="lg"
                className="w-full h-14 text-lg rounded-xl shadow-lg shadow-indigo-500/20"
            >
                <span>Customize Roadmap</span>
                <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
        </div>
    )
}
