import React, { useRef } from 'react';
import { TEXT } from '../constants';
import { Language, ProjectState } from '../types';

interface CanvasProps {
  lang: Language;
  projectState: ProjectState;
  setProjectState: React.Dispatch<React.SetStateAction<ProjectState>>;
  onGenerate: (upscale?: boolean) => void;
  onReset: () => void;
  onNewProject: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

const Canvas: React.FC<CanvasProps> = ({ 
  lang, 
  projectState, 
  setProjectState, 
  onGenerate,
  onReset,
  onNewProject,
  onUndo,
  onRedo
}) => {
  const t = TEXT[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  // Determine current image to display
  const currentImage = projectState.history.length > 0 
    ? projectState.history[projectState.historyIndex] 
    : projectState.originalImage;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, isReference: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isReference) {
          setProjectState(prev => ({ ...prev, referenceImage: result }));
        } else {
          // Main upload resets history
          setProjectState(prev => ({
            ...prev,
            originalImage: result,
            history: [],
            historyIndex: -1
          }));
        }
      };
      reader.readAsDataURL(file);
    }
    // Allow re-uploading the same file by resetting the input value
    e.target.value = '';
  };

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `perpect-ai-${Date.now()}.png`;
      link.click();
    }
  };

  const toggleFlip = () => {
    setProjectState(prev => ({ ...prev, flipX: !prev.flipX }));
  };

  const rotate = (deg: number) => {
    setProjectState(prev => ({ ...prev, rotation: prev.rotation + deg }));
  };

  const clearReferenceImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectState(prev => ({ ...prev, referenceImage: null }));
    if (refInputRef.current) refInputRef.current.value = '';
  };

  return (
    <div className="flex-1 bg-dark-900 flex flex-col h-full relative">
      
      {/* Top Bar controls */}
      <div className="h-16 border-b border-gray-700 bg-dark-800 flex items-center justify-center space-x-4 px-4">
         <button onClick={onReset} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition">
            {t.reset}
         </button>
         <button onClick={onNewProject} className="px-4 py-2 bg-red-900/50 hover:bg-red-900 rounded text-sm font-medium text-red-200 transition">
            {t.newProject}
         </button>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden p-8 bg-black/40">
        
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#555 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {currentImage ? (
          <div className="relative z-10 shadow-2xl max-h-full max-w-full transition-all duration-300 ease-in-out"
               style={{
                 transform: `rotate(${projectState.rotation}deg) scaleX(${projectState.flipX ? -1 : 1})`
               }}>
            <img 
              src={currentImage} 
              alt="Generated Content" 
              className="max-h-[70vh] max-w-full object-contain border-2 border-dark-700" 
            />
          </div>
        ) : (
          <div className="relative z-10 text-center p-10 border-2 border-dashed border-gray-700 rounded-xl hover:border-perpect-500 transition cursor-pointer bg-dark-800/50"
               onClick={() => fileInputRef.current?.click()}>
             <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 20m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             <p className="text-gray-400 text-lg font-medium">{t.uploadMain}</p>
          </div>
        )}
        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => handleUpload(e, false)} />
      </div>

      {/* Reference Image Uploader (Floating/Fixed position) */}
      <div className="absolute top-20 right-4 w-32 bg-dark-800 p-2 rounded border border-gray-700 shadow-lg z-20">
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-gray-400 font-bold uppercase">{t.referenceImage}</div>
            {projectState.referenceImage && (
              <button 
                onClick={clearReferenceImage}
                className="text-red-500 hover:text-red-400 bg-dark-900 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs transition"
                title="Remove Reference Image"
              >
                ✕
              </button>
            )}
          </div>
          <div 
            className="w-full h-24 bg-dark-900 rounded border border-gray-600 flex items-center justify-center overflow-hidden cursor-pointer hover:border-perpect-500 relative group"
            onClick={() => refInputRef.current?.click()}
          >
            {projectState.referenceImage ? (
              <>
                <img src={projectState.referenceImage} alt="Ref" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                   <span className="text-xs text-white font-medium">Change</span>
                </div>
              </>
            ) : (
              <span className="text-gray-600 text-2xl">+</span>
            )}
          </div>
          <input type="file" ref={refInputRef} hidden accept="image/*" onChange={(e) => handleUpload(e, true)} />
      </div>

      {/* Bottom Toolbar */}
      <div className="h-20 bg-dark-800 border-t border-gray-700 px-6 flex items-center justify-between z-20">
         
         <div className="flex items-center space-x-2">
            <button onClick={() => rotate(-90)} className="p-2 bg-dark-700 hover:bg-dark-600 rounded text-gray-300" title={t.rotateLeft}>
              ↺
            </button>
            <button onClick={() => rotate(90)} className="p-2 bg-dark-700 hover:bg-dark-600 rounded text-gray-300" title={t.rotateRight}>
              ↻
            </button>
            <button onClick={toggleFlip} className="p-2 bg-dark-700 hover:bg-dark-600 rounded text-gray-300" title={t.flip}>
              ⇄
            </button>
         </div>

         <div className="flex items-center space-x-4">
             {/* History Controls */}
             <div className="flex items-center space-x-2 bg-dark-700 p-1 rounded-lg">
                {/* Undo Button */}
                <button 
                  onClick={onUndo} 
                  disabled={projectState.historyIndex < 0}
                  className={`px-3 py-2 rounded font-bold flex items-center space-x-1 ${projectState.historyIndex < 0 ? 'text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
                  title={t.undo}
                >
                   <span>↩ {t.undo}</span>
                </button>
                
                <span className="text-xs text-gray-400 px-2">
                  {projectState.history.length > 0 ? projectState.historyIndex + 1 : 0}/{projectState.history.length}
                </span>

                {/* Redo Button */}
                <button 
                  onClick={onRedo} 
                  disabled={projectState.historyIndex >= projectState.history.length - 1}
                  className={`px-3 py-2 rounded font-bold flex items-center space-x-1 ${projectState.historyIndex >= projectState.history.length - 1 ? 'text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}
                  title={t.redo}
                >
                   <span>{t.redo} ↪</span>
                </button>
             </div>
         </div>

         <div className="flex items-center space-x-2">
            <button 
              onClick={() => onGenerate(true)}
              className="px-4 py-2 bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700 rounded font-medium transition flex items-center"
            >
              <span className="mr-1">✨</span> {t.upscale4k}
            </button>
            <button 
              onClick={handleDownload}
              className="px-6 py-2 bg-green-700 hover:bg-green-600 text-white rounded font-bold transition shadow-lg"
            >
              {t.download}
            </button>
         </div>

      </div>
    </div>
  );
};

export default Canvas;