export enum AIModel {
  // Flagship LLMs / Logic
  GEMINI_PRO = 'Gemini 3 Pro',
  GEMINI_FLASH = 'Gemini 1.5 Flash',
  GPT4O = 'GPT-4o (Omni)',
  CLAUDE_SONNET = 'Claude 3.5 Sonnet',
  CLAUDE_HAIKU = 'Claude 3.5 Haiku',
  DEEPSEEK_V3 = 'DeepSeek V3',
  DEEPSEEK_R1 = 'DeepSeek R1 (Reasoning)',
  GROK_2 = 'Grok-2 (X)',
  QWEN_2_5 = 'Qwen 2.5 72B',
  LLAMA_3_3 = 'Llama 3.3 70B',
  MISTRAL_LARGE = 'Mistral Large 2',
  PERPLEXITY = 'Perplexity (Research)',
  INFLECTION = 'Inflection-2.5',
  
  // Vibe Coding & Agentic Tools (Expanded to 35+ Platforms)
  CURSOR = 'Cursor AI',
  CLAUDE_CODE = 'Claude Code (CLI)',
  LOVABLE = 'Lovable.dev',
  BOLT_AI = 'Bolt.new / Bolt.ai',
  WINDSURF = 'Windsurf IDE',
  REPLIT_AGENT = 'Replit Agent',
  V0_DEV = 'v0.dev',
  GPT_ENGINEER = 'GPT Engineer',
  GITHUB_WORKSPACE = 'GitHub Workspace',
  AMAZON_Q = 'Amazon Q Developer',
  CODY_AI = 'Sourcegraph Cody',
  CODEIUM = 'Codeium',
  TABNINE = 'Tabnine',
  REPLIT_GHOSTWRITER = 'Ghostwriter',
  BOXY_AI = 'CodeSandbox Boxy',
  ANIMA = 'Anima',
  PICO = 'Pico',
  MARBLISM = 'Marblism',
  DATABUTTON = 'Databutton',
  CREATE_XYZ = 'Create.xyz',
  BUZZY = 'Buzzy.nz',
  BUBBLE_AI = 'Bubble (AI)',
  FLUTTERFLOW_AI = 'FlutterFlow (AI)',
  WEBFLOW_AI = 'Webflow (AI)',
  SOFTR_AI = 'Softr (AI)',
  RETOOL_AI = 'Retool (AI)',
  APPSMITH_AI = 'Appsmith (AI)',
  PAPYRS = 'Papyrs',
  UIZARD = 'Uizard',
  FRAMER_AI = 'Framer (AI)',
  GLIDE_AI = 'Glide AI',
  ADALO_AI = 'Adalo AI',
  BRAVO_STUDIO = 'Bravo Studio',
  MINTLIFY = 'Mintlify',
  SUPABASE_AI = 'Supabase AI',
  
  // Visual Arts
  GEMINI_3_1_IMAGE = 'Gemini 3.1 Image',
  MIDJOURNEY_V6 = 'Midjourney v6.1',
  STABLE_DIFFUSION_3 = 'SD 3.5 Ultra',
  DALLE_3 = 'DALL·E 3 (HD)',
  FLUX_PRO = 'Flux.1 [pro]',
  LEONARDO_AI = 'Leonardo.ai',
  IDEOGRAM = 'Ideogram 2.0',
  FIREFLY = 'Adobe Firefly',
  CANVA_MAGIC = 'Canva Magic Media',
  
  // Motion & Synthesis
  GEMINI_3_1_VIDEO = 'Gemini 3.1 Video (Veo)',
  SORA = 'OpenAI Sora',
  RUNWAY_GEN3 = 'Runway Gen-3 Alpha',
  KLING = 'Kling AI (Video)',
  LUMA_DREAM = 'Luma Dream Machine',
  PIKA_ART = 'Pika Art',
  HAILUO_AI = 'Hailuo AI (MiniMax)',
  
  // Audio & Music
  UDIO = 'Udio (Music)',
  SUNO_V4 = 'Suno v4',
  ELEVENLABS = 'ElevenLabs (Voice)',
  AIVA = 'AIVA',
  SOUNDRAW = 'Soundraw',

  // Custom
  OTHER = 'Other / Custom'
}

export enum OutputFormat {
  VIBE_PRD = 'Full Product PRD (Product Requirement Doc)',
  APP_BLUEPRINT = 'App Architecture & File Map',
  REFACTOR_STRATEGY = 'Strategic Refactoring Plan',
  UI_UX_SPEC = 'Component & Style Spec',
  MARKDOWN_MASTER = 'Master Markdown',
  JSON_SCHEMA = 'Strict JSON Schema',
  SYSTEM_PROMPT = 'Expert System Persona',
  CHAIN_OF_THOUGHT = 'Chain of Thought (CoT)',
  SEO_ARTICLE = 'SEO Optimized Article',
  NARRATIVE_STORY = 'Immersive Narrative',
  SCREENPLAY = 'Hollywood Screenplay',
  STORYBOARD = 'Visual Storyboard',
  REACT_DEV = 'React/Next.js Architecture',
  PYTHON_GENIUS = 'Production Python',
  UNIT_TESTER = 'Robust Unit Tests'
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  model: AIModel | string;
  originalPrompt: string;
  result: string;
  format: OutputFormat;
}

export interface PromptRequest {
  model: AIModel;
  customModelName?: string;
  format: OutputFormat;
  prompt: string;
}

export interface AppState {
  step: number;
  request: PromptRequest;
  result: string | null;
  isLoading: boolean;
  error: string | null;
  history: HistoryItem[];
  showHistory: boolean;
}