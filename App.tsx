import React, { useState, useEffect } from 'react';
import { User, UserRole, Language, ProjectState } from './types';
import { login, logout, getCurrentUser } from './services/authService';
import { generateImage } from './services/geminiService';
import { TEXT, STYLES } from './constants';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import AdminPanel from './components/AdminPanel';

const App: React.FC = () => {
  // --- Auth State ---
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- App State ---
  const [lang, setLang] = useState<Language>('th');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // --- Project State ---
  const initialProjectState: ProjectState = {
    originalImage: null,
    referenceImage: null,
    history: [],
    historyIndex: -1,
    mainPrompt: '',
    activePresetTitle: null,
    activePresetPrompt: null,
    additionalPrompt: '',
    selectedStyle: '',
    rotation: 0,
    flipX: false,
    isLoading: false,
  };

  const [projectState, setProjectState] = useState<ProjectState>(initialProjectState);
  const t = TEXT[lang];

  useEffect(() => {
    // 1. Check for existing session
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    // 2. Check for "Share Link" parameters (Auto-fill or Auto-login)
    const params = new URLSearchParams(window.location.search);
    const uParam = params.get('u');
    const pParam = params.get('p');

    if (uParam && pParam && !currentUser) {
      setUsername(uParam);
      setPassword(pParam);
      // Optional: Auto-submit
      handleLogin(null, uParam, pParam);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent | null, u?: string, p?: string) => {
    if (e) e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    const targetUser = u || username;
    const targetPass = p || password;

    try {
      const loggedUser = await login(targetUser, targetPass);
      if (loggedUser) {
        setUser(loggedUser);
        // Clear URL params if successful to hide credentials
        window.history.replaceState({}, document.title, "/");
      } else {
        setLoginError('Invalid credentials, expired account, or account suspended.');
      }
    } catch (err) {
      setLoginError('Connection error.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setUsername('');
    setPassword('');
  };

  const handleGenerate = async (upscale: boolean = false) => {
    // Determine Base Image
    let baseImgToUse = null;
    if (projectState.history.length > 0) {
       baseImgToUse = projectState.history[projectState.historyIndex];
    } else if (projectState.originalImage) {
       baseImgToUse = projectState.originalImage;
    }

    // Construct Effective Prompt
    let effectivePrompt = "";
    
    if (upscale) {
      effectivePrompt = "Upscale this image to 4K resolution, highly detailed, sharp focus";
    } else {
      // Logic: If Main Prompt (Textarea) has text, use it.
      // If it's empty, check if a Preset is active (Hidden Prompt).
      let basePrompt = projectState.mainPrompt;
      if (!basePrompt && projectState.activePresetPrompt) {
        basePrompt = projectState.activePresetPrompt;
      }

      effectivePrompt = basePrompt;
      
      // Append Style Prompt
      if (projectState.selectedStyle) {
        const styleObj = STYLES.find(s => s.id === projectState.selectedStyle);
        if (styleObj) {
          effectivePrompt += `, ${styleObj.prompt}`;
        }
      }

      // Append Additional/Refine Prompt
      if (projectState.additionalPrompt) {
        effectivePrompt += `. ${projectState.additionalPrompt}`;
      }
    }

    // If still empty (no manual text, no preset, no base image for editing), do nothing
    if (!effectivePrompt && !baseImgToUse) return;

    setProjectState(prev => ({ ...prev, isLoading: true }));

    try {
      const resultBase64 = await generateImage(
        effectivePrompt,
        baseImgToUse,
        projectState.referenceImage,
        upscale
      );

      setProjectState(prev => {
        let newHistory = [...prev.history.slice(0, prev.historyIndex + 1), resultBase64];
        if (newHistory.length > 5) {
            newHistory = newHistory.slice(newHistory.length - 5);
        }

        return {
          ...prev,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          isLoading: false,
          additionalPrompt: '' // Clear refine prompt
        };
      });

    } catch (error) {
      alert("Failed to generate image. Please check API Key configuration.");
      setProjectState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleUndo = () => {
    if (projectState.historyIndex >= 0) {
      setProjectState(prev => {
        const newIndex = prev.historyIndex - 1;
        const safeIndex = newIndex < -1 ? -1 : newIndex;
        return {
          ...prev,
          historyIndex: safeIndex
        };
      });
    }
  };

  const handleRedo = () => {
    if (projectState.historyIndex < projectState.history.length - 1) {
      setProjectState(prev => ({
        ...prev,
        historyIndex: prev.historyIndex + 1
      }));
    }
  };

  const resetProject = () => {
    setProjectState(prev => ({
       ...prev,
       history: [],
       historyIndex: -1,
       additionalPrompt: '',
       rotation: 0,
       flipX: false,
       selectedStyle: '',
       // Keep originalImage, referenceImage, mainPrompt, and activePreset
    }));
  };

  const newProject = () => {
    if (confirm("Create new project? All progress will be lost.")) {
      setProjectState(initialProjectState);
    }
  };

  // --- Render Login ---
  if (!user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="bg-dark-800 p-8 rounded-2xl shadow-2xl border border-perpect-600/30 w-full max-w-md">
          <h1 className="text-4xl font-black text-center text-perpect-500 mb-8 tracking-tighter">PERPECT AI</h1>
          <form onSubmit={(e) => handleLogin(e)} className="space-y-6">
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2">{t.username}</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-dark-900 border border-gray-600 rounded p-3 text-white focus:border-perpect-500 outline-none"
                disabled={isLoggingIn}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-bold mb-2">{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-dark-900 border border-gray-600 rounded p-3 text-white focus:border-perpect-500 outline-none"
                disabled={isLoggingIn}
              />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-perpect-600 to-perpect-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50"
            >
              {isLoggingIn ? 'Connecting to Database...' : t.login}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-400 bg-dark-900/50 p-2 rounded border border-gray-700">
             <p className="text-xs">Database Connected</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Main App ---
  return (
    <div className="h-screen w-screen flex flex-col bg-dark-900 overflow-hidden text-white font-sans selection:bg-perpect-500 selection:text-white">
      
      {/* Header */}
      <header className="h-16 bg-dark-800 border-b border-gray-700 flex justify-between items-center px-6 shadow-md z-10">
        <div className="flex items-center space-x-4">
           <h1 className="text-2xl font-black text-perpect-500 tracking-tighter">PERPECT AI</h1>
           <span className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">v1.0</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-400">
             Hi, <span className="font-bold text-white">{user.username}</span>
          </div>
          
          {user.role === UserRole.ADMIN && (
            <button 
              onClick={() => setShowAdminPanel(true)}
              className="text-sm font-medium hover:text-perpect-500 transition"
            >
              {t.adminPanel}
            </button>
          )}
          
          <button 
            onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
            className="w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-xs font-bold transition"
          >
            {lang.toUpperCase()}
          </button>
          
          <button 
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            {t.logout}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar 
          lang={lang} 
          projectState={projectState} 
          setProjectState={setProjectState}
          onGenerate={() => handleGenerate(false)} 
        />
        <Canvas 
          lang={lang} 
          projectState={projectState} 
          setProjectState={setProjectState}
          onGenerate={handleGenerate}
          onReset={resetProject}
          onNewProject={newProject}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      </div>

      {/* Admin Modal */}
      {showAdminPanel && (
        <AdminPanel lang={lang} onClose={() => setShowAdminPanel(false)} />
      )}
    </div>
  );
};

export default App;