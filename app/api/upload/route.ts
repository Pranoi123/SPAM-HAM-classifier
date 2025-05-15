import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if it's a TSV file
    if (!file.name.endsWith(".tsv")) {
      return NextResponse.json({ error: "Only TSV files are allowed" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Save to server/data directory
    const filePath = path.join(process.cwd(), "server", "data", "your_test_data.tsv")
    await writeFile(filePath, buffer)

    // Process the file with the spam detector
    // In a real app, you would call the Python script here

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
