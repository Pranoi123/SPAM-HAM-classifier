import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Message } from "@/types"

export async function GET() {
  try {
    // In a real app, this would read from your_test_data.tsv
    // and use the spam detector to classify messages

    // For demo purposes, we'll return mock data
    const spamMessages: Message[] = [
      {
        id: uuidv4(),
        content: "URGENT: You have won a $1000 gift card! Click here to claim now!",
        type: "spam",
        confidence: 0.95,
      },
      {
        id: uuidv4(),
        content: "Congratulations! You've been selected for a free iPhone. Reply YES to claim your prize!",
        type: "spam",
        confidence: 0.92,
      },
      {
        id: uuidv4(),
        content: "Your account has been compromised. Click here to verify your identity immediately.",
        type: "spam",
        confidence: 0.88,
      },
    ]

    const hamMessages: Message[] = [
      {
        id: uuidv4(),
        content: "Hi John, can we reschedule our meeting to tomorrow at 2pm?",
        type: "ham",
        confidence: 0.97,
      },
      {
        id: uuidv4(),
        content: "Your order #12345 has been shipped and will arrive on Monday.",
        type: "ham",
        confidence: 0.94,
      },
      {
        id: uuidv4(),
        content: "Don't forget to bring the documents for our discussion tomorrow.",
        type: "ham",
        confidence: 0.91,
      },
    ]

    return NextResponse.json({ spam: spamMessages, ham: hamMessages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}
