import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import type { Message } from "@/types"

export async function GET() {
  try {
    // In a real app, this would read from your_test_data.tsv
    // and return messages that need review

    // For demo purposes, we'll return mock data
    const messages: Message[] = [
      {
        id: uuidv4(),
        content: "URGENT: You have won a $1000 gift card! Click here to claim now!",
        type: "spam",
        confidence: 0.95,
      },
      {
        id: uuidv4(),
        content: "Hi John, can we reschedule our meeting to tomorrow at 2pm?",
        type: "ham",
        confidence: 0.97,
      },
      {
        id: uuidv4(),
        content: "Your account has been compromised. Click here to verify your identity immediately.",
        type: "spam",
        confidence: 0.88,
      },
      {
        id: uuidv4(),
        content: "Don't forget to bring the documents for our discussion tomorrow.",
        type: "ham",
        confidence: 0.91,
      },
      {
        id: uuidv4(),
        content: "Meeting scheduled for Friday at 3pm in the conference room.",
        type: "ham",
        confidence: 0.75,
      },
      {
        id: uuidv4(),
        content: "Limited time offer: 50% off all products this weekend only!",
        type: "spam",
        confidence: 0.65,
      },
    ]

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages for review:", error)
    return NextResponse.json({ error: "Failed to fetch messages for review" }, { status: 500 })
  }
}
