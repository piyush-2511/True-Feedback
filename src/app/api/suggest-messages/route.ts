export async function POST(request: Request) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Create a list of three open-ended, engaging questions formatted as a single string. " +
                    "Each question should be separated by '||'. These questions are for an anonymous " +
                    "social messaging platform, like Qooh.me, and should be suitable for a diverse " +
                    "audience. Avoid personal or sensitive topics, focusing instead on universal themes " +
                    "that encourage friendly interaction. For example, your output should be structured " +
                    "like this: 'What's a hobby you've recently started?||If you could have dinner with " +
                    "any historical figure, who would it be?||What's a simple thing that makes you happy?' " +
                    "Ensure the questions are intriguing, foster curiosity, and contribute to a positive " +
                    "and welcoming conversational environment. Only return the questions, no preamble.",
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 300,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error("Gemini API error:", errData);
      return Response.json(
        { success: false, message: "Failed to generate suggestions" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return Response.json(
        { success: false, message: "No suggestions generated" },
        { status: 500 }
      );
    }

    return Response.json({ success: true, message: text }, { status: 200 });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return Response.json(
      { success: false, message: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}