import React, { useState } from 'react';
import { TEXT, PRESETS, STYLES } from '../constants';
import { Language, ProjectState } from '../types';

interface SidebarProps {
  lang: Language;
  projectState: ProjectState;
  setProjectState: React.Dispatch<React.SetStateAction<ProjectState>>;
  onGenerate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ lang, projectState, setProjectState, onGenerate }) => {
  const t = TEXT[lang];
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isStyleExpanded, setIsStyleExpanded] = useState(false);

  const toggleCategory = (cat: string) => {
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  const handlePresetClick = (prompt: string, title: string) => {
    // Logic: Set the Hidden Prompt and Hidden Title. Clear the Visible Textarea.
    setProjectState(prev => ({ 
      ...prev, 
      activePresetTitle: title,
      activePresetPrompt: prompt,
      mainPrompt: '' // Clear manual input to keep it clean
    }));
  };

  const handleManualPromptChange = (val: string) => {
    // If user types manually, clear the active preset to avoid confusion
    setProjectState(prev => ({ 
      ...prev, 
      mainPrompt: val,
      activePresetTitle: null,
      activePresetPrompt: null
    }));
  };

  const clearActivePreset = () => {
    setProjectState(prev => ({
      ...prev,
      activePresetTitle: null,
      activePresetPrompt: null
    }));
  };

  const toggleStyle = (styleId: string) => {
    setProjectState(prev => ({
      ...prev,
      selectedStyle: prev.selectedStyle === styleId ? '' : styleId
    }));
  };

  return (
    <div className="w-80 bg-dark-800 border-r border-gray-700 flex flex-col h-full overflow-hidden">
      <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
        {/* Main Prompt */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider">
              {t.mainPrompt}
            </label>
            {projectState.activePresetTitle && (
              <span className="text-[10px] text-green-400 bg-green-900/30 px-2 py-0.5 rounded border border-green-800">
                Preset Active
              </span>
            )}
          </div>
          
          {projectState.activePresetTitle ? (
             // Active Preset Indicator
             <div className="w-full h-32 bg-dark-900/50 border border-perpect-600 rounded-lg p-3 flex flex-col items-center justify-center text-center relative group">
                <p className="text-gray-400 text-xs mb-1">Using Preset:</p>
                <p className="text-white font-bold text-sm mb-2 px-2">{projectState.activePresetTitle}</p>
                <button 
                  onClick={clearActivePreset}
                  className="text-xs bg-dark-700 hover:bg-red-900 text-gray-300 hover:text-white px-3 py-1.5 rounded transition border border-gray-600"
                >
                  Clear / Type Manual
                </button>
             </div>
          ) : (
             // Manual Text Area
             <textarea
              value={projectState.mainPrompt}
              onChange={(e) => handleManualPromptChange(e.target.value)}
              className="w-full h-32 bg-dark-900 border border-gray-600 rounded-lg p-3 text-white focus:border-perpect-500 focus:ring-1 focus:ring-perpect-500 outline-none resize-none transition placeholder-gray-600"
              placeholder={lang === 'th' ? "พิมพ์คำสั่งของคุณที่นี่..." : "Describe your image..."}
            />
          )}
        </div>

        {/* Additional Prompt */}
        <div className="mb-6">
          <label className="block text-gray-400 font-bold mb-2 text-xs uppercase tracking-wider">
            {t.additionalPrompt}
          </label>
          <input
            type="text"
            value={projectState.additionalPrompt}
            onChange={(e) => setProjectState(prev => ({ ...prev, additionalPrompt: e.target.value }))}
            className="w-full bg-dark-900 border border-gray-600 rounded-lg p-3 text-white focus:border-perpect-500 outline-none placeholder-gray-600"
            placeholder="+ Add details (e.g. rain, blue light)"
          />
        </div>

        {/* Image Style (Main) - Collapsible */}
        <div className="mb-6 border border-gray-700 rounded-lg overflow-hidden">
          <button
            onClick={() => setIsStyleExpanded(!isStyleExpanded)}
            className="w-full flex justify-between items-center p-3 bg-dark-700 hover:bg-dark-600 transition"
          >
            <span className="text-gray-200 font-bold text-xs uppercase tracking-wider">{t.imageStyle}</span>
            <span className="text-gray-400">{isStyleExpanded ? '−' : '+'}</span>
          </button>
          
          {isStyleExpanded && (
            <div className="p-3 bg-dark-900 border-t border-gray-700">
              <div className="flex flex-col gap-2">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => toggleStyle(style.id)}
                    className={`w-full p-2 text-xs font-medium rounded border transition-all duration-200 text-left pl-4
                      ${projectState.selectedStyle === style.id 
                        ? 'bg-perpect-600 text-white border-perpect-600 shadow-lg scale-[1.01]' 
                        : 'bg-dark-800 text-gray-400 border-gray-600 hover:border-gray-500 hover:text-white'
                      }`}
                  >
                    {style.label[lang]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Presets */}
        <div className="mb-6">
          <h3 className="text-gray-400 font-bold mb-3 text-xs uppercase tracking-wider">{t.presets}</h3>
          <div className="space-y-2">
            {PRESETS.map((preset) => (
              <div key={preset.category} className="border border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleCategory(preset.category)}
                  className="w-full flex justify-between items-center p-3 bg-dark-700 hover:bg-dark-600 transition text-sm font-medium"
                >
                  <span>{preset.category}</span>
                  <span>{expandedCategory === preset.category ? '−' : '+'}</span>
                </button>
                {expandedCategory === preset.category && (
                  <div className="bg-dark-900 p-2 space-y-1">
                    {preset.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => handlePresetClick(item.prompt, item.title)}
                        className={`w-full text-left text-xs p-2 rounded transition truncate flex items-center
                          ${projectState.activePresetTitle === item.title 
                             ? 'bg-perpect-600/20 text-perpect-500 border border-perpect-600/50' 
                             : 'text-gray-400 hover:text-white hover:bg-gray-800'}`
                        }
                        title={item.prompt}
                      >
                        {projectState.activePresetTitle === item.title && <span className="mr-2">✓</span>}
                        {item.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Button Area */}
      <div className="p-6 bg-dark-900 border-t border-gray-700">
        <button
          onClick={onGenerate}
          disabled={projectState.isLoading}
          className={`w-full py-4 rounded-xl text-white font-bold text-xl tracking-widest shadow-lg transform transition-all 
            ${projectState.isLoading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-perpect-600 to-perpect-500 hover:scale-[1.02] hover:shadow-perpect-500/20'
            }`}
        >
          {projectState.isLoading ? t.processing : t.generate}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;