
import React from 'react';
import { AIModel } from '../types';

interface ModelCardProps {
  model: AIModel;
  selected: boolean;
  onClick: () => void;
  icon: string;
  category: string;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, selected, onClick, icon, category }) => {
  return (
    <button
      onClick={onClick}
      className={`relative p-5 rounded-2xl border transition-all duration-300 text-left flex flex-col items-start gap-4 overflow-hidden group ${
        selected 
          ? 'border-blue-400 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
          : 'border-slate-800 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/60'
      }`}
    >
      {/* Background Decor */}
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full blur-2xl transition-all duration-500 ${selected ? 'bg-blue-500/20' : 'bg-transparent group-hover:bg-slate-700/20'}`}></div>

      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
        selected ? 'bg-blue-500 text-white scale-110 shadow-lg' : 'bg-slate-800 text-slate-400'
      }`}>
        <i className={`${icon} text-lg`}></i>
      </div>
      
      <div className="z-10">
        <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 block ${selected ? 'text-blue-300' : 'text-slate-500'}`}>
          {category}
        </span>
        <h3 className="font-bold text-sm md:text-base text-slate-100">{model}</h3>
      </div>

      {selected && (
        <div className="absolute top-4 right-4 animate-in zoom-in duration-300">
          <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg">
            <i className="fa-solid fa-check text-[10px]"></i>
          </div>
        </div>
      )}
    </button>
  );
};

export default ModelCard;
