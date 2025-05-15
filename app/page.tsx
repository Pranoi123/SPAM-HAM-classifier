import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Spam Classifier System</h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Upload TSV files, classify messages as SPAM or HAM, and help improve the system with your feedback.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/upload">
          <Button size="lg">Upload TSV File</Button>
        </Link>
        <Link href="/dashboard">
          <Button size="lg" variant="outline">
            View Dashboard
          </Button>
        </Link>
      </div>

      <div className="mt-12 bg-muted p-6 rounded-lg max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">How it works</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Upload your TSV file containing messages</li>
          <li>The system automatically classifies messages as SPAM or HAM</li>
          <li>Review the classifications and correct any mistakes</li>
          <li>Your feedback is saved and helps improve the system</li>
          <li>The corrected data is added to the training dataset</li>
        </ol>
      </div>
    </div>
  )
}
