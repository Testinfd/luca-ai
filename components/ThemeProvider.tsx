import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Theme, ThemeMode } from '../types';
import { 
  getThemeByName, 
  getThemeByMode, 
  loadThemePreference, 
  saveThemePreference 
} from '../services/themeService';

interface ThemeContextType {
  theme: Theme;
  themeName: string;
  themeMode: ThemeMode;
  setThemeName: (name: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { themeName: savedThemeName, mode: savedThemeMode } = loadThemePreference();
  const [themeName, setThemeName] = useState<string>(savedThemeName);
  const [themeMode, setThemeMode] = useState<ThemeMode>(savedThemeMode);
  
  // Update the theme whenever name or mode changes
  const theme = useMemo(() => {
    return getThemeByMode(themeName, themeMode);
  }, [themeName, themeMode]);
  
  // Toggle between light and dark mode
  const toggleThemeMode = () => {
    setThemeMode(prevMode => {
      if (prevMode === ThemeMode.LIGHT) return ThemeMode.DARK;
      if (prevMode === ThemeMode.DARK) return ThemeMode.LIGHT;
      // If system, get current system preference and toggle opposite
      return getThemeByMode(themeName, ThemeMode.SYSTEM).mode === ThemeMode.LIGHT
        ? ThemeMode.DARK
        : ThemeMode.LIGHT;
    });
  };
  
  // Handler for theme name change
  const handleSetThemeName = (name: string) => {
    setThemeName(name);
  };
  
  // Handler for theme mode change
  const handleSetThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
  };
  
  // Save preferences to localStorage whenever they change
  useEffect(() => {
    saveThemePreference(themeName, themeMode);
    
    // Apply CSS variables to the root element
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Set a data attribute for the theme mode
    root.setAttribute('data-theme', theme.mode);
    
  }, [theme, themeName, themeMode]);
  
  // Listen for system preference changes
  useEffect(() => {
    if (themeMode !== ThemeMode.SYSTEM) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Force a re-render when system preference changes
      setThemeMode(ThemeMode.SYSTEM);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);
  
  const contextValue = {
    theme,
    themeName,
    themeMode,
    setThemeName: handleSetThemeName,
    setThemeMode: handleSetThemeMode,
    toggleThemeMode,
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}; 