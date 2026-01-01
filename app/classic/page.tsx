"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

// Simulated API
const fakeApi = {
  getTodos: () => new Promise<string[]>((resolve) => setTimeout(() => resolve(["Buy milk", "Walk dog"]), 1000)),
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

export default function ClassicPattern() {
  // PROBLEM 1: Three separate states for one concern
  const [todos, setTodos] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // PROBLEM 2: Submission needs its own loading/error states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [inputValue, setInputValue] = useState("")

  // PROBLEM 3: useEffect for data fetching - race conditions possible
  useEffect(() => {
    let cancelled = false // Manual cleanup to prevent race conditions

    async function fetchTodos() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fakeApi.getTodos()
        if (!cancelled) {
          setTodos(data)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to fetch")
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    fetchTodos()
    return () => {
      cancelled = true
    }
  }, [])

  // PROBLEM 4: Manual state orchestration for submissions
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault() // PROBLEM 5: Must prevent default, breaks without JS

    if (!inputValue.trim()) return

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const newTodo = await fakeApi.addTodo(inputValue)
      setTodos((prev) => [...prev, newTodo])
      setInputValue("")
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to add")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>

        <div>
          <h1 className="text-2xl font-bold">Classic Pattern</h1>
          <p className="text-muted-foreground">useState + useEffect</p>
        </div>

        {/* Problems highlighted */}
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm space-y-2">
          <p className="font-semibold text-destructive">Problems with this pattern:</p>
          <ul className="text-muted-foreground space-y-1">
            <li>
              1. <strong>Boilerplate</strong> - 6 useState calls for one feature
            </li>
            <li>
              2. <strong>Race conditions</strong> - Need manual cleanup in useEffect
            </li>
            <li>
              3. <strong>No progressive enhancement</strong> - Form breaks without JS
            </li>
            <li>
              4. <strong>State synchronization</strong> - Easy to forget resetting error states
            </li>
            <li>
              5. <strong>Loading state management</strong> - Must track per-action
            </li>
          </ul>
        </div>

        {/* The actual form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add todo (type 'error' to simulate failure)"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add"}
          </Button>
        </form>

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        {/* List display */}
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo, i) => (
                <li key={i} className="p-3 rounded bg-muted">
                  {todo}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
