"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const fakeApi = {
  addTodo: (text: string) =>
    new Promise<string>((resolve, reject) =>
      setTimeout(() => {
        if (text.toLowerCase().includes("error")) {
          reject(new Error("Server rejected this todo"))
        }
        resolve(text)
      }, 1000),
    ),
}

export default function TransitionPattern() {
  const [todos, setTodos] = useState<string[]>(["Buy milk", "Walk dog"])
  const [error, setError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")

  // IMPROVEMENT: useTransition gives us pending state automatically
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // Still need this - still client-only

    if (!inputValue.trim()) return

    // IMPROVEMENT: Wrap async work in startTransition
    // React automatically tracks pending state
    startTransition(async () => {
      try {
        setError(null)
        const newTodo = await fakeApi.addTodo(inputValue)
        setTodos((prev) => [...prev, newTodo])
        setInputValue("")
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to add")
      }
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Transition Pattern</h1>
          <p className="text-muted-foreground">useTransition (React 18+)</p>
        </div>

        {/* Improvements */}
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-sm space-y-2">
          <p className="font-semibold text-green-600">What's improved:</p>
          <ul className="text-muted-foreground space-y-1">
            <li>
              ✓ <strong>No manual loading state</strong> - isPending is automatic
            </li>
            <li>
              ✓ <strong>Non-blocking</strong> - UI stays responsive during transition
            </li>
            <li>
              ✓ <strong>Interruptible</strong> - New actions can cancel stale ones
            </li>
          </ul>
        </div>

        {/* Remaining problems */}
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm space-y-2">
          <p className="font-semibold text-destructive">Still remaining:</p>
          <ul className="text-muted-foreground space-y-1">
            <li>• Still client-only (no progressive enhancement)</li>
            <li>• Still need manual error state</li>
            <li>• Still need preventDefault</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add todo (type 'error' to simulate failure)"
            disabled={isPending}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Adding..." : "Add"}
          </Button>
        </form>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <ul className="space-y-2">
          {todos.map((todo, i) => (
            <li key={i} className="p-3 rounded bg-muted">
              {todo}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
