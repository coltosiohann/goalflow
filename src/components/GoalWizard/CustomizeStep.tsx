import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

interface CustomizeStepProps {
    timeframe: number
    setTimeframe: (days: number) => void
    onGenerate: () => void
    loading: boolean
}

export function CustomizeStep({ timeframe, setTimeframe, onGenerate, loading }: CustomizeStepProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Final Details</h2>
                <p className="text-muted-foreground">Adjust the pace to fit your schedule.</p>
            </div>

            {/* Timeframe Section */}
            <div className="space-y-4 bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-neutral-100 dark:border-white/5">
                <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> Duration</span>
                    <span className="text-indigo-600 font-bold">{timeframe} days</span>
                </label>

                <Slider
                    value={[timeframe]}
                    onValueChange={(vals) => setTimeframe(vals[0])}
                    min={7}
                    max={180}
                    step={1}
                    className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Fast (1 week)</span>
                    <span>Deep Dive (6 months)</span>
                </div>
            </div>

            {/* Placeholder for Daily Commitment (Visual only for now as backend doesn't support it yet) */}
            <div className="space-y-3 opacity-50 cursor-not-allowed hidden">
                {/* Hidden for MVP until backend supports tasks/day adjustment */}
            </div>

            <Button
                onClick={onGenerate}
                disabled={loading}
                size="lg"
                className="w-full h-14 text-lg rounded-xl shadow-lg shadow-indigo-500/20"
            >
                {loading ? "Generating Personalized Roadmap..." : "Create My Plan"}
            </Button>
        </div>
    )
}
