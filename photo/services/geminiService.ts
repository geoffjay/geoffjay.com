import { GoogleGenAI, Type } from "@google/genai";
import { PREDEFINED_TAGS } from "../constants";

export const suggestTagsForImage = async (
  base64Image: string,
  existingTags: string[],
): Promise<string[]> => {
  try {
    // Initialize Gemini here to ensure fresh API key from the environment/dialog
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-2.5-flash"; // Multimodal support

    const prompt = `
      Analyze this image and suggest up to 5 relevant tags.

      Prioritize using tags from this predefined list if they apply:
      ${PREDEFINED_TAGS.join(", ")}

      If the image content is not well described by the predefined list, generate new, concise, one-word tags.
      Do not suggest tags that are already present: ${existingTags.join(", ")}.

      Return the result as a JSON array of strings.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity/conversion
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
          },
        },
      },
    });

    const jsonStr = response.text;
    if (!jsonStr) return [];

    const tags = JSON.parse(jsonStr) as string[];
    return tags;
  } catch (error) {
    console.error("Error suggesting tags with Gemini:", error);
    throw error;
  }
};
