"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Save } from "lucide-react"
import { MessageCard } from "@/components/message-card"
import type { Message } from "@/types"

export default function ReviewPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [corrections, setCorrections] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/messages/review")

      if (!response.ok) {
        throw new Error("Failed to fetch messages for review")
      }

      const data = await response.json()
      setMessages(data.messages || [])
    } catch (err) {
      setError("Failed to load messages for review. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCorrection = (id: string, newType: string) => {
    setCorrections((prev) => ({
      ...prev,
      [id]: newType,
    }))
  }

  const handleSaveCorrections = async () => {
    if (Object.keys(corrections).length === 0) {
      setError("No corrections to save")
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/messages/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ corrections }),
      })

      if (!response.ok) {
        throw new Error("Failed to save corrections")
      }

      setSuccess("Corrections saved successfully!")
      setCorrections({})

      // Refresh messages after saving
      await fetchMessages()

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      setError("Failed to save corrections. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const getMessageWithCorrections = (message: Message) => {
    if (corrections[message.id]) {
      return {
        ...message,
        type: corrections[message.id],
      }
    }
    return message
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Review & Correct Classifications</h1>
        <Button onClick={handleSaveCorrections} disabled={loading || saving || Object.keys(corrections).length === 0}>
          <Save className="mr-2 h-4 w-4" />
          Save Corrections
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert
          variant="success"
          className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400"
        >
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">Loading messages...</CardContent>
          </Card>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No messages available for review
            </CardContent>
          </Card>
        ) : (
          messages.map((message) => (
            <MessageCard
              key={message.id}
              message={getMessageWithCorrections(message)}
              onCorrect={handleCorrection}
              isReviewMode={true}
            />
          ))
        )}
      </div>

      {Object.keys(corrections).length > 0 && (
        <div className="sticky bottom-4 flex justify-center">
          <Button size="lg" onClick={handleSaveCorrections} disabled={saving} className="shadow-lg">
            <Save className="mr-2 h-4 w-4" />
            Save {Object.keys(corrections).length} Correction{Object.keys(corrections).length !== 1 ? "s" : ""}
          </Button>
        </div>
      )}
    </div>
  )
}
