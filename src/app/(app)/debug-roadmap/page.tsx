"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type DebugRoadmapAnalysis = {
  milestones_count: number
  tasks_count: number
  expected_tasks: number
  tasks_per_day: Record<string, number>
}

type DebugRoadmapResult = {
  analysis?: DebugRoadmapAnalysis
  error?: string
  [key: string]: unknown
}

export default function DebugRoadmapPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DebugRoadmapResult | null>(null)

  const testRoadmapGeneration = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/debug-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: 'Learn React in 7 days',
          timeframe_days: 7
        })
      })

      const data = await response.json()
      setResult(data)
      console.log('[DEBUG] Full response:', data)
    } catch (error) {
      console.error('[DEBUG] Error:', error)
      setResult({ error: String(error) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-6 text-3xl font-bold">Debug Roadmap Generation</h1>

      <Card className="p-6">
        <Button
          onClick={testRoadmapGeneration}
          disabled={loading}
          size="lg"
        >
          {loading ? 'Testing...' : 'Test: Generate "Learn React in 7 days"'}
        </Button>

        {result && (
          <div className="mt-6">
            <h2 className="mb-3 text-xl font-semibold">Results:</h2>

            {result.analysis && (
              <div className="mb-4 rounded-lg bg-blue-50 p-4">
                <h3 className="mb-2 font-semibold text-blue-900">Analysis:</h3>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>✓ Milestones: {result.analysis.milestones_count}</li>
                  <li>✓ Total Tasks: {result.analysis.tasks_count}</li>
                  <li>✓ Expected (3-4 per day): {result.analysis.expected_tasks}+</li>
                  <li className={result.analysis.tasks_count >= result.analysis.expected_tasks ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                    {result.analysis.tasks_count >= result.analysis.expected_tasks
                      ? '✓ PASS: Enough tasks generated'
                      : '✗ FAIL: Not enough tasks generated'}
                  </li>
                </ul>

                <div className="mt-3">
                  <h4 className="font-semibold text-blue-900">Tasks per day:</h4>
                  <pre className="mt-1 text-xs text-blue-800">
                    {JSON.stringify(result.analysis.tasks_per_day, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer font-semibold">Full Response (click to expand)</summary>
              <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-xs">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>

            <div className="mt-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
              <p className="font-semibold">Check your browser console for detailed logs!</p>
              <p className="mt-1">Press F12 or Right-click → Inspect → Console tab</p>
            </div>
          </div>
        )}
      </Card>

      <div className="mt-8 rounded-lg bg-neutral-100 p-6">
        <h2 className="mb-3 text-lg font-semibold">What this test does:</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm">
          <li>Calls OpenAI with the same prompt as your real goal creation</li>
          <li>Shows how many tasks the AI actually generates</li>
          <li>Shows tasks per day breakdown</li>
          <li>Helps identify if the problem is:
            <ul className="mt-1 list-disc pl-5 text-xs">
              <li>AI not generating enough tasks</li>
              <li>Database insertion failing</li>
              <li>Other issues</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  )
}
