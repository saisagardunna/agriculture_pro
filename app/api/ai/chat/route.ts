// app/api/ai/chat/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY;

// Initialize GoogleGenerativeAI only if the key exists
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    // Input Validation
    if (!message || typeof message !== 'string' || message.trim() === '') {
      console.warn("API Call: Received empty or invalid message.");
      return NextResponse.json({ error: 'Message content is required.' }, { status: 400 });
    }

    // Check if API key was loaded and genAI was initialized
    if (!genAI) {
      console.error("Server Error: GoogleGenerativeAI was not initialized. GEMINI_API_KEY is likely missing or invalid.");
      return NextResponse.json({ error: 'Server configuration error: AI service is not properly configured.' }, { status: 500 });
    }

    // *** THE CRUCIAL CHANGE IS HERE ***
    // Use a more generic or specific model that is known to be available.
    // 'gemini-1.5-flash' or 'gemini-1.5-pro' are newer, more stable options.
    // If you need the older 'gemini-pro', sometimes it's available as 'gemini-pro-vision' for multi-modal.
    // For text-only, 'gemini-1.5-flash' is a good choice for general use.
    // IMPORTANT: Check Google AI Studio's "Get API Key" section for the exact model names
    // that are available to you. 'gemini-1.5-flash' and 'gemini-1.5-pro' are generally available.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Changed from "gemini-pro"

    const prompt = `You are an expert agriculture assistant. Provide helpful, accurate advice about farming, crops, pest control, soil management, and agricultural practices. Keep responses practical and actionable.

User question: ${message}`;

    console.log("Sending prompt to Gemini:", prompt); // Log the actual prompt being sent

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Received response from Gemini:", text); // Log the AI's response

    return NextResponse.json({ response: text }, { status: 200 });

  } catch (error: any) {
    console.error("AI chat error caught in route.ts:", error);

    let errorMessage = "Failed to get AI response. Please try again.";
    let statusCode = 500;

    // More specific error handling based on GoogleGenerativeAI errors
    if (error.status) {
      statusCode = error.status;
      if (statusCode === 429) {
        errorMessage = "The AI service is currently busy (Rate Limit Exceeded). Please try again in a moment.";
      } else if (statusCode === 403) {
        errorMessage = "Authentication error with AI service. Check your API key and project permissions in Google Cloud Console.";
      } else if (statusCode === 400) {
        errorMessage = "Bad request to AI service. Ensure your input is valid or prompt is not too long.";
      } else if (statusCode === 404) { // Explicitly handle 404 for model not found
        errorMessage = "AI model not found or not available. This might be due to an incorrect model name or regional availability.";
      }
       else {
        errorMessage = `AI service error: ${statusCode} - ${error.message || 'Unknown error'}`;
      }
    } else if (error.response && error.response.status) {
        // Fallback for raw fetch errors or older SDK error structures
        statusCode = error.response.status;
        errorMessage = `AI service response error: ${statusCode} - ${error.response.statusText || 'Unknown AI service error.'}`;
    } else if (error.message) {
      errorMessage = `An unexpected error occurred: ${error.message}`;
    }

    console.error(`Detailed AI API Error: Status ${statusCode}, Message: ${errorMessage}`);

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}