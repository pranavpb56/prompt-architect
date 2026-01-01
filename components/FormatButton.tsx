
import React from 'react';
import { OutputFormat } from '../types';

interface FormatButtonProps {
  format: OutputFormat;
  selected: boolean;
  onClick: () => void;
}

const FormatButton: React.FC<FormatButtonProps> = ({ format, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg border transition-all ${
        selected
          ? 'bg-purple-600 border-purple-400 text-white shadow-md'
          : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
      }`}
    >
      {format}
    </button>
  );
};

export default FormatButton;
