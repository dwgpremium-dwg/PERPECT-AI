import { GoogleGenAI } from "@google/genai";

// Helper to remove data URL prefix for API
const cleanBase64 = (dataUrl: string) => {
  return dataUrl.split(',')[1];
};

const getMimeType = (dataUrl: string) => {
  return dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
};

export const generateImage = async (
  prompt: string,
  baseImage: string | null,
  referenceImage: string | null,
  isUpscale: boolean = false
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Model Selection Logic
  // Default: gemini-2.5-flash-image for speed/standard gen
  // Upscale/High Quality: gemini-3-pro-image-preview
  let modelName = 'gemini-2.5-flash-image';
  
  if (isUpscale) {
    modelName = 'gemini-3-pro-image-preview';
  }

  const parts: any[] = [];

  // 1. If we have a base image (editing/refining)
  if (baseImage) {
    parts.push({
      inlineData: {
        data: cleanBase64(baseImage),
        mimeType: getMimeType(baseImage),
      },
    });
  }

  // 2. If we have a reference image
  if (referenceImage) {
    parts.push({
      inlineData: {
        data: cleanBase64(referenceImage),
        mimeType: getMimeType(referenceImage),
      },
    });
    
    // Updated Logic: If both images exist, treat 1st as Main Subject and 2nd as Background/Atmosphere
    if (baseImage) {
      prompt = `${prompt} \n\n[MASTER INSTRUCTION]: 
      1. IMAGE 1 is the SUBJECT. IMAGE 2 is the BACKGROUND/STYLE REFERENCE.
      2. COMPOSITE: Place the SUBJECT into the BACKGROUND of Image 2.
      3. CRITICAL - HARMONIZATION: 
         - LIGHTING: Perfectly match the direction, hardness, and color temperature of the light from Image 2 onto the Subject.
         - SHADOWS: Cast realistic shadows from the Subject onto the ground/surfaces of Image 2. Ensure contact shadows are present so the subject does not look like it is floating.
         - COLOR GRADING: Adjust the levels, curves, and color balance of the Subject to match the exact filmic look and mood of Image 2.
      4. RESULT: The final image must look like a single, authentic photograph. No visible cutouts, mismatched lighting, or perspective errors. Flawless integration.`;
    } else {
      prompt = `${prompt}. Use the provided reference image for style, composition, and color palette.`;
    }
  }

  // 3. Add text prompt
  parts.push({ text: prompt });

  try {
    const config: any = {
      // aspectRatio: "1:1", // Default, let model decide or UI could control this
    };

    if (isUpscale) {
       config.imageConfig = {
         imageSize: "4K"
       };
    }

    // Call generateContent. For Image models, it can return text or image data in inlineData.
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: config
    });

    // Parse Response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image generated.");

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};