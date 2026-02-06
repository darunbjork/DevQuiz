# DevQuiz: Technical Deep Dive

This document provides a developer-focused explanation of the question generation and parsing process in DevQuiz.

## High-Level Flow

1.  **User Input**: The user provides study notes on the `/study` page.
2.  **API Request**: The frontend constructs a detailed prompt and sends it to the Gemini API.
3.  **API Response**: The Gemini API returns a formatted string containing the quiz.
4.  **Parsing**: The frontend parses the string into a structured data format.
5.  **State Update**: The parsed data is stored in the React component's state.
6.  **UI Render**: The UI updates to display the quiz questions.

## Core Components

*   **`src/pages/Study/index.tsx`**: The main page component for the study feature. It manages the state for the study notes, quiz questions, and loading status.
*   **`src/services/quizGenerator.ts`**: This service is responsible for communicating with the Gemini API.
*   **`src/utils/quizParser.ts`**: This utility contains the logic for parsing the raw text response from the API into a structured format.

## Detailed Process

### 1. User Interaction (`/study` page)

The user interacts with the `StudyNotesInput` component. Upon clicking "Generate Quiz", the `handleGenerateQuiz` function in `src/pages/Study/index.tsx` is invoked.

### 2. API Call (`quizGenerator.ts`)

The `handleGenerateQuiz` function calls `generateQuizFromNotes`, passing the user's study notes.

`generateQuizFromNotes` assembles a prompt with specific formatting instructions and sends it to the Gemini API endpoint `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`.

The `fetch` API is used to make a `POST` request. The body of the request is a JSON object containing the prompt.

### 3. Response Parsing (`quizParser.ts`)

The raw text response from the Gemini API is passed to the `parseQuizText` function.

`parseQuizText` works as follows:
*   It splits the input string into an array of lines.
*   It iterates through each line, using regular expressions to identify questions (`/^Q(\d+):/`), options (`/^[A-D]\)/`), and the correct answer (`/^Correct:/`).
*   It progressively builds an array of `QuizQuestion` objects. Each object includes an `id`, `question` text, an array of `options`, and the `correctAnswer` index.

### Limitations of Current Parsing

The current parsing mechanism in `src/utils/quizParser.ts` relies heavily on regular expressions to extract structured quiz data from the AI's plain-text response. While functional, this approach presents significant limitations:<br>

*   **Brittle Data Extraction**: The regex patterns are highly dependent on the AI generating output in a precise, predefined format. Any minor deviation by the AI (e.g., extra spaces, different punctuation, or unexpected line breaks) can lead to parsing failures, resulting in incomplete or corrupted quiz data.<br>
*   **Data Integrity Risk**: Since there's no formal schema validation, the system cannot reliably ensure that the extracted data conforms to the expected `QuizQuestion` structure. This can lead to unexpected behavior in the application.<br>
*   **Lack of Robustness**: This method is not robust against variations in AI output, which can change over time or with different models. It makes the application vulnerable to changes outside its direct control.<br><br>

**Recommendation for improved reliability:** Instead of relying on brittle regex parsing of plain text, a more secure and robust approach would be to instruct the AI to generate the quiz content directly as a **JSON object**. This would allow the application to use standard and reliable JSON parsing (`JSON.parse()`) and schema validation (e.g., using libraries like Zod) to ensure data integrity and create a much more resilient parsing process.

### Proposed Solution: Robust Quiz Parsing with JSON and Schema Validation

To address the brittleness and improve reliability, the recommended approach is to leverage JSON output from the AI combined with schema validation. This provides a "middleware" layer for data integrity.

**Core Steps:**<br>

1.  **Update the AI Prompt for JSON Output**: Instruct the AI to generate content *exclusively* in a specified JSON format.<br>
    ```typescript
    const jsonPrompt = `You are an AI that generates multiple-choice quiz questions.
    Create EXACTLY 5 questions based on the study notes below.
    RESPOND WITH VALID JSON ONLY. No markdown, no explanations, no code blocks.
    Required JSON structure:
    {
      "questions": [
        {
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correctAnswer": 0
        }
      ]
    }
    correctAnswer must be 0, 1, 2, or 3 (index of correct option).
    STUDY NOTES:
    ${studyNote}`;
    ```<br>
2.  **Request JSON from Gemini API**: Explicitly set `responseMimeType` to `application/json` in the API call's `generationConfig` to encourage structured output.<br>
    ```typescript
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: jsonPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",  // Force JSON output
        },
      }),
    });
    ```<br>
3.  **Implement Zod Schema Validation**: Use a library like Zod to define the expected structure of the AI's JSON response. This acts as a robust validation "middleware."<br>
    ```typescript
    import { z } from "zod";

    const QuizQuestionSchema = z.object({
      question: z.string().min(1),
      options: z.array(z.string()).length(4),
      correctAnswer: z.number().int().min(0).max(3),
    });

    const QuizResponseSchema = z.object({
      questions: z.array(QuizQuestionSchema).length(5),
    });

    type QuizResponse = z.infer<typeof QuizResponseSchema>;
    ```<br>
4.  **Parse and Validate AI Response**: After fetching, parse the response as JSON and then validate it against the defined Zod schema. Handle validation failures gracefully.<br>
    ```typescript
    export const generateQuizFromNotes = async (studyNote: string): Promise<{
      questions: QuizQuestion[];
      error?: string;
    }> => {
      try {
        // ... fetch code ...

        const data = await response.json();
        const aiResponse = data.candidates[0].content.parts[0].text;

        const parsedJson = JSON.parse(aiResponse); // Raw JSON parse
        const validated = QuizResponseSchema.safeParse(parsedJson); // Zod validation

        if (!validated.success) {
          console.error("Validation errors:", validated.error.issues);
          return { questions: [], error: "AI response format invalid" };
        }

        const questions: QuizQuestion[] = validated.data.questions.map((q, i) => ({
          id: Date.now() + i,
          ...q,
        }));

        return { questions };

      } catch (error) {
        return { questions: [], error: "Failed to generate quiz" };
      }
    };
    ```<br>

**Benefits of this Approach:**<br>

*   **Reduced Prompt Complexity**: The prompt focuses on content and structure, not overly rigid formatting.<br>
*   **Robust Error Handling**: Zod provides explicit, detailed error messages for malformed responses.<br>
*   **Type Safety**: Automatic type inference from Zod schemas improves developer experience and reduces runtime errors.<br>
*   **Increased Reliability**: JSON mode is generally more consistent, and validation catches any remaining inconsistencies.<br>

### Alternative Approaches<br>

*   **Leverage APIs with Guaranteed Structured Output**: Some generative AI APIs (e.g., OpenAI with `response_format: { type: "json_object" }`) offer stronger guarantees for JSON output, which can further reduce parsing issues.<br>
*   **Hybrid Approach (Text Sanitization)**: If direct JSON output is not consistently reliable, an intermediary sanitization step can be added. This involves pre-processing the raw text response to remove common extraneous elements (like markdown code blocks or conversational intros) before attempting `JSON.parse()`.<br>
    ```typescript
    const sanitizeAiResponse = (text: string): string => {
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, ''); // Remove markdown code blocks
      text = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1); // Extract potential JSON part
      return text;
    };
    // Then parse and validate:
    // const jsonString = sanitizeAiResponse(aiResponse);
    // const parsed = JSON.parse(jsonString);
    // const validated = QuizResponseSchema.safeParse(parsed);
    ```<br>
    This hybrid method is still more fragile than direct JSON output but can improve the success rate for inconsistent text responses. Zod validation remains crucial here.<br>
*   **XML or YAML Output**: While JSON is generally preferred for its simplicity and wide support in web development, other structured data formats like XML or YAML could also be used if there's a specific ecosystem or tooling advantage. However, this would still require similar schema definition and validation steps.<br>
*   **Fine-tuning/Custom Models**: For ultimate control and consistency, fine-tuning a smaller AI model on specific quiz formats could be considered. This is a more advanced solution requiring significant data and expertise.

### 4. State Management and UI

The array of `QuizQuestion` objects returned by `parseQuizText` is used to update the `quizQuestions` state in the `Study` component.

React's state update triggers a re-render, and the `QuizQuestionsDisplay` component then renders the questions, options, and other interactive elements.

This architecture ensures a clean separation of concerns, with distinct modules for API interaction, data parsing, and UI representation.

<br>