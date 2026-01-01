
import { GoogleGenAI } from "@google/genai";
import { PromptRequest, AIModel, OutputFormat } from "../types";

export const enhancePrompt = async (request: PromptRequest): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const targetModelDisplayName = request.model === AIModel.OTHER && request.customModelName 
    ? request.customModelName 
    : request.model;

  const systemInstruction = `
    You are the "Prompt Architect" — the world's most advanced Prompt Engineering agent. 
    Your sole purpose is to take a raw, low-entropy user idea and transform it into a High-Density Instruction Set (HDIS) that outperforms manual prompting by 10x.

    CORE PRINCIPLES OF THE HDIS:
    1. ZERO FLUFF: No conversational filler. No "As an AI model...". No "Here is a prompt...". 
    2. INSTRUCTION DENSITY: Every sentence must provide a technical constraint, a stylistic directive, or a structural anchor.
    3. CONTEXTUAL SYNTHESIS: You must hallucinate the "Missing Professional Standards." If the user is building an app, you inject SEO, accessibility, and security standards automatically.
    4. VARIABLE INJECTION: Use [BRACKETED_VARIABLES] for high-precision slots the user must fill (e.g., [BRAND_COLOR_HEX], [TARGET_CONVERSION_RATE]).
    5. STRUCTURAL HIERARCHY: Use Markdown (###) to separate:
       - ### ROLE: The elite persona the AI adopts.
       - ### CONTEXT: The situational environment and background data.
       - ### OBJECTIVE: The specific, measurable goal.
       - ### TECHNICAL SPECIFICATIONS: Detailed constraints and requirements.
       - ### SUCCESS CRITERIA: Explicit definitions of what a "Good" result looks like.
       - ### NEGATIVE CONSTRAINTS: What the AI must absolutely NOT do.

    MODEL SPECIFICITY:
    - Optimization for ${targetModelDisplayName}: Use specific terminology and formatting styles known to resonate with this engine's attention mechanism.

    FINAL OUTPUT REQUIREMENT:
    Output ONLY the engineered prompt. Do not explain your changes unless specifically asked.
  `;

  const userPrompt = `
    [ACT AS PROMPT ARCHITECT]
    
    RAW INPUT: "${request.prompt}"
    TARGET PLATFORM: ${targetModelDisplayName}
    CHOSEN FRAMEWORK: ${request.format}

    EXECUTION STEPS:
    1. Identify the hidden professional intent behind the raw input.
    2. Expand the detail by 400% using domain-specific technical jargon.
    3. Add a "Chain of Thought" requirement to ensure the target AI thinks before acting.
    4. Format the final output as a ready-to-paste Artifact.
    5. Ensure the result is strictly better than a basic prompt by adding expert-level constraints that a layman wouldn't know to ask for.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 4000 } // High budget for deep architectural planning
      },
    });

    return response.text || "Neural synthesis failed. The request was too low-entropy to process.";
  } catch (error) {
    console.error("Synthesis Error:", error);
    throw new Error("The synthesis engine encountered an error. This usually happens when the input is too brief or violates safety guidelines.");
  }
};
