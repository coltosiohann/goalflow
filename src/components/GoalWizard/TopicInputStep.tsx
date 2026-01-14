import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Target, ArrowRight } from "lucide-react"

interface TopicInputStepProps {
    topic: string
    setTopic: (topic: string) => void
    onNext: () => void
}

export function TopicInputStep({ topic, setTopic, onNext }: TopicInputStepProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">What do you want to learn?</h2>
                <p className="text-muted-foreground">The first step to mastery is defining the target.</p>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Goal Topic
                </label>
                <Input
                    autoFocus
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Learn Python, Master Chess, Run a 5k..."
                    className="h-14 text-lg px-6 rounded-xl bg-white/50 dark:bg-black/20"
                    onKeyDown={(e) => e.key === "Enter" && topic.trim() && onNext()}
                />
            </div>

            <Button
                onClick={onNext}
                disabled={!topic.trim()}
                size="lg"
                className="w-full h-12 text-lg rounded-xl"
            >
                <span>Next Step</span>
                <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
        </div>
    )
}
