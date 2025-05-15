"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface MessageActionBarProps {
  currentType: string
  onCorrect: (newType: string) => void
}

export function MessageActionBar({ currentType, onCorrect }: MessageActionBarProps) {
  const isSpam = currentType.toLowerCase() === "spam"

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className={
          isSpam
            ? "text-green-600"
            : "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
        }
        onClick={() => onCorrect("ham")}
        disabled={!isSpam}
      >
        <Check className="h-4 w-4 mr-1" />
        Mark as HAM
      </Button>

      <Button
        variant="outline"
        size="sm"
        className={
          !isSpam ? "text-red-600" : "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900"
        }
        onClick={() => onCorrect("spam")}
        disabled={isSpam}
      >
        <X className="h-4 w-4 mr-1" />
        Mark as SPAM
      </Button>
    </div>
  )
}
