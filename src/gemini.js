import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function getSmartPlan(syllabus, days, hours) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Act as a study planner for a BCA student. 
    Syllabus: ${syllabus}
    Days left: ${days}
    Daily study hours: ${hours}
    Return ONLY a valid JSON array. Do not include markdown tags.
    Example format:
    [{"day": 1, "subject": "C++", "topics": ["Pointers", "Arrays"]}]`;

    const result = await model.generateContent(prompt);
    return await result.response.text();
    
  } catch (error) {
    console.error("Gemini SDK Error:", error);
    return null; 
  }
}