"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageList } from "@/components/message-list"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import type { Message } from "@/types"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [spamMessages, setSpamMessages] = useState<Message[]>([])
  const [hamMessages, setHamMessages] = useState<Message[]>([])

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/messages")

      if (!response.ok) {
        throw new Error("Failed to fetch messages")
      }

      const data = await response.json()

      setSpamMessages(data.spam || [])
      setHamMessages(data.ham || [])
    } catch (err) {
      setError("Failed to load messages. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleReviewClick = () => {
    router.push("/review")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Message Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchMessages} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleReviewClick}>Review Messages</Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="bg-red-50 dark:bg-red-950/20">
            <CardTitle className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              SPAM Messages
            </CardTitle>
            <CardDescription>Messages classified as spam ({spamMessages.length})</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <MessageList messages={spamMessages} loading={loading} emptyMessage="No spam messages found" type="spam" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-green-50 dark:bg-green-950/20">
            <CardTitle className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              HAM Messages
            </CardTitle>
            <CardDescription>Messages classified as ham ({hamMessages.length})</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <MessageList messages={hamMessages} loading={loading} emptyMessage="No ham messages found" type="ham" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
