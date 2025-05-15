import { MessageCard } from "@/components/message-card"
import type { Message } from "@/types"

interface MessageListProps {
  messages: Message[]
  loading: boolean
  emptyMessage: string
  type: "spam" | "ham"
}

export function MessageList({ messages, loading, emptyMessage, type }: MessageListProps) {
  if (loading) {
    return <div className="p-6 text-center text-muted-foreground">Loading messages...</div>
  }

  if (messages.length === 0) {
    return <div className="p-6 text-center text-muted-foreground">{emptyMessage}</div>
  }

  return (
    <div className="divide-y">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} isReviewMode={false} />
      ))}
    </div>
  )
}
