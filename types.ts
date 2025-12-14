export type Language = 'th' | 'en';

export enum UserRole {
  ADMIN = 'admin',
  MEMBER = 'member'
}

export interface User {
  id: string;
  username: string;
  password?: string; // In a real app, never store plain text. Using for mock auth.
  role: UserRole;
  isActive: boolean;
  expirationDate?: string; // ISO Date string
  assignedApiKey?: string;
  isOnline?: boolean;
}

export interface ProjectState {
  originalImage: string | null; // Base64
  referenceImage: string | null; // Base64
  history: string[]; // Array of Base64 strings (Undo stack)
  historyIndex: number;
  mainPrompt: string;       // Visible text in textarea
  activePresetTitle: string | null;  // Title of the hidden preset
  activePresetPrompt: string | null; // Content of the hidden preset
  additionalPrompt: string;
  selectedStyle: string; // Style ID
  rotation: number;
  flipX: boolean;
  isLoading: boolean;
}

export interface PresetItem {
  title: string;
  prompt: string;
}

export interface Preset {
  category: string;
  items: PresetItem[];
}