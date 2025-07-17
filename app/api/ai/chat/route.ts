import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const prompt = `You are an expert agriculture assistant. Provide helpful, accurate advice about farming, crops, pest control, soil management, and agricultural practices. Keep responses practical and actionable.

User question: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error("AI chat error:", error)
    return NextResponse.json({ message: "Failed to get AI response" }, { status: 500 })
  }
}
