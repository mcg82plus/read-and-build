import { GoogleGenAI, Type } from "@google/genai";
import { Story, QuizData, Item } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStory = async (age: number, userName: string, gender: string, friends: string[]): Promise<Story> => {
  const model = "gemini-2.5-flash";
  const themes = ["Adventure", "Fantasy", "Science Fiction", "Nature", "Friendship", "Mystery"];
  const randomTheme = themes[Math.floor(Math.random() * themes.length)];
  
  const genderTerm = gender === 'Kız' ? 'kız' : 'erkek';

  // Prompt for the story text
  const storyPrompt = `Write a short, engaging story in Turkish for a ${age}-year-old ${genderTerm}. 
  CRITICAL: The main character IS AND MUST BE the user named "${userName}". 
  "${userName}" must be the one taking actions and solving problems.
  Include the best friends named ${friends.join(" and ")} as supporting characters/sidekicks only.
  The theme is ${randomTheme}. 
  
  MANDATORY: The story MUST start exactly with this phrase: "Bir varmış; bir yokmuş. Evvel zaman içinde, kalbur saman içinde. Develer tellal iken, pireler berber iken. Ben dedemin beşiğini tıngır mıngır sallarken…"

  The story should be about 150-200 words long. 
  It should be simple, fun, and easy to read.
  Avoid scary content.`;

  const textResponse = await ai.models.generateContent({
    model,
    contents: storyPrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING },
          theme: { type: Type.STRING },
        },
        required: ["title", "content", "theme"],
      },
    },
  });

  const text = textResponse.text;
  if (!text) throw new Error("No response from Gemini");
  const storyData = JSON.parse(text) as Story;

  // Generate an image for the story
  try {
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `Children's book illustration, colorful, vibrant, flat vector art style. 
      Scene: A ${genderTerm} named ${userName} in a ${storyData.theme} setting. 
      Action: ${storyData.title}. 
      Cute, friendly, suitable for kids.`,
      config: {
        numberOfImages: 1,
        aspectRatio: '16:9',
      },
    });
    
    const base64Image = imageResponse.generatedImages?.[0]?.image?.imageBytes;
    if (base64Image) {
      storyData.imageUrl = `data:image/png;base64,${base64Image}`;
    }
  } catch (e) {
    console.error("Failed to generate image", e);
    // Continue without image if fails
  }

  return storyData;
};

export const generateQuiz = async (story: Story, age: number): Promise<QuizData> => {
  const model = "gemini-2.5-flash";
  const prompt = `Based on the following story, generate 3 multiple-choice questions in Turkish to test comprehension for a ${age}-year-old child.
  
  Story Title: ${story.title}
  Story Content: ${story.content}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Array of 3 possible answers in Turkish" 
                },
                correctIndex: { 
                  type: Type.INTEGER, 
                  description: "The index (0-2) of the correct answer in the options array" 
                },
              },
              required: ["text", "options", "correctIndex"],
            },
          },
        },
        required: ["questions"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text) as QuizData;
};

export const generateRewardOptions = async (storyTheme: string, existingItems: string[]): Promise<Omit<Item, 'x' | 'y' | 'id'>[]> => {
  const model = "gemini-2.5-flash";
  const prompt = `Generate 3 DISTINCT and fun, kid-friendly reward item choices (toys, decorations, or pets) related to the theme "${storyTheme}".
  The items should be suitable to place in a child's virtual room/island/spaceship.
  Do NOT suggest these items: ${existingItems.join(", ")}.
  Provide a single emoji that best represents each item.
  The name and description must be in Turkish.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Short name of the item in Turkish" },
                emoji: { type: Type.STRING, description: "A single emoji representing the item" },
                description: { type: Type.STRING, description: "A one-sentence exciting description in Turkish" },
              },
              required: ["name", "emoji", "description"],
            }
          }
        },
        required: ["options"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  const data = JSON.parse(text) as { options: Omit<Item, 'x' | 'y' | 'id'>[] };
  return data.options;
};