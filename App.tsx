
import React, { useState, useMemo, useEffect } from 'react';
import { AIModel, OutputFormat, AppState, HistoryItem } from './types';
import { enhancePrompt } from './services/geminiService';
import ModelCard from './components/ModelCard';

const App: React.FC = () => {
  const initialHistory = useMemo(() => {
    try {
      const saved = localStorage.getItem('prompt_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }, []);

  const [state, setState] = useState<AppState>({
    step: 1,
    request: {
      model: AIModel.GEMINI_PRO,
      format: OutputFormat.MARKDOWN_MASTER,
      prompt: '',
    },
    result: null,
    isLoading: false,
    error: null,
    history: initialHistory,
    showHistory: false,
  });

  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Vibe Coding' | 'Logic' | 'Image' | 'Video' | 'Audio' | 'Research' | 'Creative'>('All');

  useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(state.history));
  }, [state.history]);

  const modelsList = useMemo(() => [
    // Vibe Coding Platforms
    { model: AIModel.CURSOR, icon: 'fa-solid fa-terminal', cat: 'Vibe Coding' },
    { model: AIModel.CLAUDE_CODE, icon: 'fa-solid fa-code', cat: 'Vibe Coding' },
    { model: AIModel.LOVABLE, icon: 'fa-solid fa-heart', cat: 'Vibe Coding' },
    { model: AIModel.BOLT_AI, icon: 'fa-solid fa-bolt-lightning', cat: 'Vibe Coding' },
    { model: AIModel.WINDSURF, icon: 'fa-solid fa-wind', cat: 'Vibe Coding' },
    { model: AIModel.REPLIT_AGENT, icon: 'fa-solid fa-square-rss', cat: 'Vibe Coding' },
    { model: AIModel.V0_DEV, icon: 'fa-solid fa-v', cat: 'Vibe Coding' },
    { model: AIModel.GPT_ENGINEER, icon: 'fa-solid fa-gears', cat: 'Vibe Coding' },
    { model: AIModel.GITHUB_WORKSPACE, icon: 'fa-brands fa-github', cat: 'Vibe Coding' },
    { model: AIModel.AMAZON_Q, icon: 'fa-brands fa-aws', cat: 'Vibe Coding' },
    { model: AIModel.SUPABASE_AI, icon: 'fa-solid fa-database', cat: 'Vibe Coding' },
    { model: AIModel.ANIMA, icon: 'fa-solid fa-wand-magic-sparkles', cat: 'Vibe Coding' },
    { model: AIModel.MARBLISM, icon: 'fa-solid fa-cube', cat: 'Vibe Coding' },
    { model: AIModel.CREATE_XYZ, icon: 'fa-solid fa-shapes', cat: 'Vibe Coding' },
    { model: AIModel.UIZARD, icon: 'fa-solid fa-pen-nib', cat: 'Vibe Coding' },
    { model: AIModel.FRAMER_AI, icon: 'fa-solid fa-palette', cat: 'Vibe Coding' },

    // Logic
    { model: AIModel.GEMINI_PRO, icon: 'fa-solid fa-sparkles', cat: 'Logic' },
    { model: AIModel.GEMINI_FLASH, icon: 'fa-solid fa-bolt', cat: 'Logic' },
    { model: AIModel.GPT4O, icon: 'fa-solid fa-brain', cat: 'Logic' },
    { model: AIModel.CLAUDE_SONNET, icon: 'fa-solid fa-feather', cat: 'Logic' },
    { model: AIModel.DEEPSEEK_R1, icon: 'fa-solid fa-atom', cat: 'Logic' },
    { model: AIModel.GROK_2, icon: 'fa-solid fa-x', cat: 'Logic' },
    { model: AIModel.LLAMA_3_3, icon: 'fa-solid fa-hippo', cat: 'Logic' },
    
    // Image
    { model: AIModel.GEMINI_3_1_IMAGE, icon: 'fa-solid fa-wand-magic-sparkles', cat: 'Image' },
    { model: AIModel.MIDJOURNEY_V6, icon: 'fa-solid fa-mountain-sun', cat: 'Image' },
    { model: AIModel.DALLE_3, icon: 'fa-solid fa-paintbrush', cat: 'Image' },
    { model: AIModel.FLUX_PRO, icon: 'fa-solid fa-atom', cat: 'Image' },
    { model: AIModel.IDEOGRAM, icon: 'fa-solid fa-font', cat: 'Image' },
    
    // Video
    { model: AIModel.GEMINI_3_1_VIDEO, icon: 'fa-solid fa-film', cat: 'Video' },
    { model: AIModel.SORA, icon: 'fa-solid fa-video', cat: 'Video' },
    { model: AIModel.RUNWAY_GEN3, icon: 'fa-solid fa-film', cat: 'Video' },
    { model: AIModel.KLING, icon: 'fa-solid fa-dragon', cat: 'Video' },
    { model: AIModel.LUMA_DREAM, icon: 'fa-solid fa-moon', cat: 'Video' },
    
    // Audio & Research
    { model: AIModel.UDIO, icon: 'fa-solid fa-guitar', cat: 'Audio' },
    { model: AIModel.SUNO_V4, icon: 'fa-solid fa-music', cat: 'Audio' },
    { model: AIModel.ELEVENLABS, icon: 'fa-solid fa-microphone-lines', cat: 'Audio' },
    { model: AIModel.PERPLEXITY, icon: 'fa-solid fa-magnifying-glass', cat: 'Research' },

    // Custom
    { model: AIModel.OTHER, icon: 'fa-solid fa-plus', cat: 'All' },
  ], []);

  const filteredModels = useMemo(() => {
    if (activeFilter === 'All') {
      return modelsList.filter(m => m.cat !== 'Vibe Coding');
    }
    return modelsList.filter(m => m.cat === activeFilter);
  }, [activeFilter, modelsList]);

  // Model-specific Expert Recommendations
  const modelRecommendations = useMemo(() => {
    const model = state.request.model;

    if ([AIModel.GEMINI_3_1_VIDEO, AIModel.SORA, AIModel.RUNWAY_GEN3, AIModel.KLING, AIModel.LUMA_DREAM].includes(model)) {
      return {
        best: [OutputFormat.JSON_SCHEMA, OutputFormat.STORYBOARD, OutputFormat.SCREENPLAY],
        reason: "Video models work best with structured scene data. JSON helps keep camera and action details consistent across the video."
      };
    }

    if (activeFilter === 'Vibe Coding' || [AIModel.CURSOR, AIModel.BOLT_AI, AIModel.LOVABLE, AIModel.WINDSURF, AIModel.V0_DEV].includes(model)) {
      return {
        best: [OutputFormat.VIBE_PRD, OutputFormat.APP_BLUEPRINT, OutputFormat.REACT_DEV],
        reason: "Coding assistants need a clear plan (PRD) to understand how different files and components work together."
      };
    }

    if ([AIModel.CLAUDE_SONNET, AIModel.CLAUDE_CODE, AIModel.CLAUDE_HAIKU].includes(model)) {
      return {
        best: [OutputFormat.SYSTEM_PROMPT, OutputFormat.MARKDOWN_MASTER, OutputFormat.APP_BLUEPRINT],
        reason: "Claude is excellent at following clear headers and structured tags like <task> or <context>."
      };
    }

    if ([AIModel.DEEPSEEK_R1, AIModel.GROK_2].includes(model)) {
      return {
        best: [OutputFormat.CHAIN_OF_THOUGHT, OutputFormat.SYSTEM_PROMPT],
        reason: "Reasoning models perform much better when you ask them to 'think step-by-step' using a clear thought process."
      };
    }

    if ([AIModel.MIDJOURNEY_V6, AIModel.GEMINI_3_1_IMAGE, AIModel.FLUX_PRO, AIModel.DALLE_3].includes(model)) {
      return {
        best: [OutputFormat.MARKDOWN_MASTER, OutputFormat.NARRATIVE_STORY, OutputFormat.STORYBOARD],
        reason: "Image models love descriptive details about lighting, camera lenses, and textures."
      };
    }

    if ([AIModel.GEMINI_PRO, AIModel.GEMINI_FLASH].includes(model)) {
      return {
        best: [OutputFormat.MARKDOWN_MASTER, OutputFormat.JSON_SCHEMA, OutputFormat.CHAIN_OF_THOUGHT],
        reason: "Gemini is great at following structured lists and clear headings to keep the output focused."
      };
    }

    return {
      best: [OutputFormat.MARKDOWN_MASTER, OutputFormat.SYSTEM_PROMPT],
      reason: "Standard tasks usually work best with a clear role and a structured list of goals."
    };
  }, [state.request.model, activeFilter]);

  const contextQuality = useMemo(() => {
    const len = state.request.prompt.length;
    if (len === 0) return 0;
    if (len < 20) return 20;
    if (len < 100) return 50;
    if (len < 300) return 80;
    return 100;
  }, [state.request.prompt]);

  const handleGenerate = async () => {
    if (!state.request.prompt.trim()) {
      setState(prev => ({ ...prev, error: "Please enter your idea first." }));
      return;
    }
    setState(prev => ({ ...prev, isLoading: true, error: null, step: 4 }));
    try {
      const result = await enhancePrompt(state.request);
      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        model: state.request.model === AIModel.OTHER ? (state.request.customModelName || 'Custom') : state.request.model,
        originalPrompt: state.request.prompt,
        result: result,
        format: state.request.format,
      };
      setState(prev => ({ ...prev, result, isLoading: false, history: [newHistoryItem, ...prev.history].slice(0, 50) }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message, step: 3 }));
    }
  };

  const copyToClipboard = (text?: string) => {
    const content = text || state.result;
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-slate-100 selection:bg-blue-600/30 font-inter">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px]"></div>
      </div>

      <nav className="relative z-50 px-8 py-8 flex items-center justify-between border-b border-white/5 backdrop-blur-xl sticky top-0">
        <div className="flex items-center gap-4 cursor-pointer group" onClick={() => setState(p => ({...p, step: 1, result: null}))}>
          <div className="relative w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
             <span className="text-blue-500 text-xl font-black italic">P</span>
             <div className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter leading-none group-hover:text-blue-400 transition-colors uppercase">Prompt<span className="text-blue-500 italic">.Architect</span></h1>
            <p className="text-[9px] uppercase tracking-[0.5em] font-bold text-slate-500 mt-1">Better Prompts, Better Results</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button onClick={() => setState(s => ({...s, showHistory: true}))} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-colors">History</button>
          <div className="px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 text-[9px] font-black tracking-[0.2em] text-blue-400 uppercase">System Ready</div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {state.step === 1 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">Pick Your <span className="text-blue-500">AI</span></h2>
              <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">Different AI models need different instructions. Start by picking the one you want to use.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {['All', 'Vibe Coding', 'Logic', 'Image', 'Video', 'Audio', 'Research'].map(f => (
                <button 
                  key={f}
                  onClick={() => setActiveFilter(f as any)}
                  className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeFilter === f ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredModels.map(m => (
                <ModelCard 
                  key={`${m.model}-${m.cat}`}
                  model={m.model}
                  selected={state.request.model === m.model}
                  onClick={() => setState(prev => ({ ...prev, request: { ...prev.request, model: m.model }, error: null }))}
                  icon={m.icon}
                  category={m.cat}
                />
              ))}
            </div>

            <div className="pt-8 max-w-xl mx-auto">
              <button 
                onClick={() => {
                  if (!modelRecommendations.best.includes(state.request.format)) {
                    setState(p => ({ ...p, step: 2, request: { ...p.request, format: modelRecommendations.best[0] } }));
                  } else {
                    setState(p => ({ ...p, step: 2 }));
                  }
                }}
                className="w-full py-7 bg-blue-600 hover:bg-blue-500 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all transform active:scale-[0.98]"
              >
                Choose Best Format
              </button>
            </div>
          </div>
        )}

        {state.step === 2 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
             <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">Pick <span className="text-blue-500">Format</span></h2>
              <p className="text-slate-400 text-lg">We've selected the best structure for {state.request.model}.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
               <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/30 shadow-lg">
                  <i className="fa-solid fa-lightbulb text-2xl"></i>
               </div>
               <div className="space-y-2 text-center md:text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Expert Advice</h4>
                  <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed">
                    "{modelRecommendations.reason}"
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(OutputFormat).map(format => {
                const isBestFit = modelRecommendations.best.includes(format);
                return (
                  <button
                    key={format}
                    onClick={() => setState(prev => ({ ...prev, request: { ...prev.request, format } }))}
                    className={`relative p-8 rounded-[2rem] border text-left transition-all group ${
                      state.request.format === format ? 'bg-blue-600/10 border-blue-400 shadow-xl' : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    {isBestFit && (
                      <div className="absolute top-0 right-0">
                         <div className="bg-blue-600 text-[8px] font-black px-5 py-2 rounded-bl-2xl uppercase tracking-[0.2em] text-white border-l border-b border-blue-400">Best Choice</div>
                      </div>
                    )}
                    <h3 className="font-black text-sm uppercase tracking-tighter text-slate-200 group-hover:text-blue-400 transition-colors">{format.split(' (')[0]}</h3>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      {format.includes('(') ? format.split(' (')[1].replace(')', '') : 'Standard'}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 max-w-2xl mx-auto w-full">
              <button onClick={() => setState(p => ({...p, step: 1}))} className="flex-1 py-6 bg-white/5 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest border border-white/5">Back</button>
              <button onClick={() => setState(p => ({...p, step: 3}))} className="flex-[2] py-6 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl">Next: Enter Idea</button>
            </div>
          </div>
        )}

        {state.step === 3 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">Your <span className="text-blue-500">Idea</span></h2>
              <p className="text-slate-400 text-lg leading-relaxed">Describe what you want to do. We will turn it into a professional prompt for you.</p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <textarea
                value={state.request.prompt}
                onChange={(e) => setState(prev => ({ ...prev, request: { ...prev.request, prompt: e.target.value } }))}
                placeholder="Example: I want to build a simple dashboard for my business..."
                className="w-full h-96 p-12 bg-[#080808] border border-white/10 rounded-[3rem] focus:outline-none focus:border-blue-500/50 text-xl md:text-2xl leading-relaxed text-slate-200 placeholder:text-slate-800 custom-scrollbar shadow-inner"
              />
              
              <div className="absolute bottom-10 right-12 flex flex-col items-end gap-3">
                 <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Detail Level</span>
                 <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${contextQuality < 40 ? 'bg-red-500' : contextQuality < 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`} style={{ width: `${contextQuality}%` }}></div>
                 </div>
              </div>
            </div>

            <div className="flex gap-4 max-w-4xl mx-auto w-full">
              <button onClick={() => setState(p => ({...p, step: 2}))} className="flex-1 py-6 bg-white/5 text-slate-400 rounded-3xl font-black text-xs uppercase tracking-widest">Back</button>
              <button onClick={handleGenerate} className="flex-[3] py-6 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center justify-center gap-4">
                <i className="fa-solid fa-magic text-blue-300"></i> Create My Prompt
              </button>
            </div>
          </div>
        )}

        {state.step === 4 && (
          <div className="space-y-12 animate-in fade-in zoom-in duration-700">
            {state.isLoading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-10">
                <div className="w-28 h-28 relative">
                  <div className="absolute inset-0 border-4 border-blue-500/10 rounded-full"></div>
                  <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-wand-magic-sparkles text-blue-400 text-3xl animate-pulse"></i>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <h3 className="text-4xl font-black uppercase tracking-tighter italic">Creating Your Prompt</h3>
                  <div className="flex justify-center gap-6">
                     <span className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">Adding Details</span>
                     <span className="text-slate-600 text-[9px] font-black uppercase tracking-[0.4em]">Polishing Text</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-10 max-w-5xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-white/10">
                  <div className="space-y-3">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.5em]">Tuned for {state.request.model}</span>
                    <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">The <span className="text-blue-500">Prompt</span></h2>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => copyToClipboard()} className={`px-12 py-6 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center gap-4 ${copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
                      <i className={copied ? "fa-solid fa-check" : "fa-solid fa-copy"}></i>
                      {copied ? 'Copied' : 'Copy Prompt'}
                    </button>
                    <button onClick={() => setState(p => ({...p, step: 1, result: null}))} className="px-10 py-6 bg-white/5 text-slate-300 rounded-3xl font-black text-xs uppercase tracking-widest">Start Over</button>
                  </div>
                </div>

                <div className="bg-[#080808] border border-white/10 rounded-[4rem] overflow-hidden shadow-2xl relative">
                  <div className="bg-white/5 px-12 py-6 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-white/5">
                    <span>Ready to use</span>
                    <span className="text-blue-500 flex items-center gap-2">DONE</span>
                  </div>
                  <div className="p-16 max-h-[800px] overflow-y-auto custom-scrollbar">
                    <pre className="text-lg md:text-2xl leading-[1.6] text-slate-300 whitespace-pre-wrap font-mono selection:bg-blue-500/40">
                      {state.result}
                    </pre>
                  </div>
                </div>

                <div className="p-10 bg-blue-500/5 border border-blue-500/10 rounded-[3rem] text-center">
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.3em] leading-loose">
                      <i className="fa-solid fa-circle-info text-blue-500 mr-2"></i>
                      Note: Just copy this text and paste it directly into {state.request.model}.
                   </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <div className="fixed bottom-0 left-0 w-full h-1 bg-white/5 z-[100]">
        <div className="h-full bg-blue-500 transition-all duration-1000 ease-out shadow-[0_0_20px_#3b82f6]" style={{ width: `${(state.step / 4) * 100}%` }}></div>
      </div>
    </div>
  );
};

export default App;
