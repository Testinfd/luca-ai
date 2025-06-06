import { Theme, ThemeColors, ThemeMode } from '../types';

// Light theme colors
const lightColors: ThemeColors = {
  primary: '#6366f1', // indigo-500
  secondary: '#8b5cf6', // violet-500
  accent: '#ec4899', // pink-500
  background: '#f9fafb', // gray-50
  surface: '#ffffff', // white
  text: '#1f2937', // gray-800
  textSecondary: '#6b7280', // gray-500
  error: '#ef4444', // red-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  info: '#3b82f6', // blue-500
};

// Dark theme colors
const darkColors: ThemeColors = {
  primary: '#818cf8', // indigo-400
  secondary: '#a78bfa', // violet-400
  accent: '#f472b6', // pink-400
  background: '#111827', // gray-900
  surface: '#1f2937', // gray-800
  text: '#f9fafb', // gray-50
  textSecondary: '#9ca3af', // gray-400
  error: '#f87171', // red-400
  success: '#34d399', // emerald-400
  warning: '#fbbf24', // amber-400
  info: '#60a5fa', // blue-400
};

// Predefined themes
export const themes: Record<string, Theme> = {
  modern: {
    name: 'Modern',
    mode: ThemeMode.LIGHT,
    colors: lightColors,
  },
  modernDark: {
    name: 'Modern Dark',
    mode: ThemeMode.DARK,
    colors: darkColors,
  },
  ocean: {
    name: 'Ocean',
    mode: ThemeMode.LIGHT,
    colors: {
      ...lightColors,
      primary: '#0ea5e9', // sky-500
      secondary: '#06b6d4', // cyan-500
      accent: '#3b82f6', // blue-500
    },
  },
  oceanDark: {
    name: 'Ocean Dark',
    mode: ThemeMode.DARK,
    colors: {
      ...darkColors,
      primary: '#38bdf8', // sky-400
      secondary: '#22d3ee', // cyan-400
      accent: '#60a5fa', // blue-400
    },
  },
  forest: {
    name: 'Forest',
    mode: ThemeMode.LIGHT,
    colors: {
      ...lightColors,
      primary: '#10b981', // emerald-500
      secondary: '#059669', // emerald-600
      accent: '#4ade80', // green-400
    },
  },
  forestDark: {
    name: 'Forest Dark',
    mode: ThemeMode.DARK,
    colors: {
      ...darkColors,
      primary: '#34d399', // emerald-400
      secondary: '#10b981', // emerald-500
      accent: '#4ade80', // green-400
    }
  },
  sunset: {
    name: 'Sunset',
    mode: ThemeMode.LIGHT,
    colors: {
      ...lightColors,
      primary: '#f97316', // orange-500
      secondary: '#ef4444', // red-500
      accent: '#f59e0b', // amber-500
    }
  },
  sunsetDark: {
    name: 'Sunset Dark',
    mode: ThemeMode.DARK,
    colors: {
      ...darkColors,
      primary: '#fb923c', // orange-400
      secondary: '#f87171', // red-400
      accent: '#fbbf24', // amber-400
    }
  },
};

// Helper function to get theme by name
export const getThemeByName = (name: string): Theme => {
  return themes[name] || themes.modern;
};

// Helper function to get system preference
export const getSystemThemePreference = (): ThemeMode => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return ThemeMode.DARK;
  }
  return ThemeMode.LIGHT;
};

// Helper to get theme based on mode
export const getThemeByMode = (themeName: string, preferredMode: ThemeMode): Theme => {
  const baseTheme = getThemeByName(themeName);
  
  // If system preference is requested, determine it
  const targetMode = preferredMode === ThemeMode.SYSTEM 
    ? getSystemThemePreference() 
    : preferredMode;
  
  // If theme already matches the target mode, return it
  if (baseTheme.mode === targetMode) {
    return baseTheme;
  }
  
  // Try to find a matching theme with the desired mode
  const themePair = Object.keys(themes).find(key => {
    return themes[key].mode === targetMode && 
      (themes[key].name.includes(baseTheme.name) || baseTheme.name.includes(themes[key].name));
  });
  
  if (themePair) {
    return themes[themePair];
  }
  
  // Fall back to the first theme matching the desired mode
  const fallbackTheme = Object.keys(themes).find(key => themes[key].mode === targetMode);
  return fallbackTheme ? themes[fallbackTheme] : baseTheme;
};

// Save theme preference to localStorage
export const saveThemePreference = (themeName: string, mode: ThemeMode): void => {
  localStorage.setItem('themePreference', JSON.stringify({ themeName, mode }));
};

// Load theme preference from localStorage
export const loadThemePreference = (): { themeName: string, mode: ThemeMode } => {
  const savedPreference = localStorage.getItem('themePreference');
  if (savedPreference) {
    try {
      return JSON.parse(savedPreference);
    } catch (e) {
      console.error('Failed to parse saved theme preference', e);
    }
  }
  return { themeName: 'modern', mode: ThemeMode.SYSTEM };
}; 