"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MessageActionBar } from "@/components/message-action-bar"
import type { Message } from "@/types"

interface MessageCardProps {
  message: Message
  onCorrect?: (id: string, newType: string) => void
  isReviewMode: boolean
}

export function MessageCard({ message, onCorrect, isReviewMode }: MessageCardProps) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  const handleCorrect = (newType: string) => {
    if (onCorrect) {
      onCorrect(message.id, newType)
    }
  }

  const getTypeColor = (type: string) => {
    return type.toLowerCase() === "spam"
      ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-950/70"
      : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-950/50 dark:text-green-400 dark:hover:bg-green-950/70"
  }

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors">
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <div className="font-medium line-clamp-1">{message.content}</div>
            <div className="text-sm text-muted-foreground mt-1">ID: {message.id.substring(0, 8)}...</div>
          </div>
          <Badge className={getTypeColor(message.type)}>{message.type.toUpperCase()}</Badge>
        </div>

        {expanded && <div className="mt-2 text-sm bg-muted p-3 rounded-md">{message.content}</div>}

        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={toggleExpand}>
            {expanded ? "Show Less" : "Show More"}
          </Button>

          {isReviewMode && <MessageActionBar currentType={message.type} onCorrect={handleCorrect} />}
        </div>
      </div>
    </div>
  )
}
