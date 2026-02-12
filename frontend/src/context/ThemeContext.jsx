import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColor = localStorage.getItem('primaryColor') || '#3B82F6';
    
    setTheme(savedTheme);
    setPrimaryColor(savedColor);
    
    // Apply theme to document
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    // Ensure CSS variables reflect the current theme immediately
    applyThemeVariables(savedTheme);

  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    // Update CSS variables for immediate visual change
    applyThemeVariables(newTheme);
    console.log('Dark mode active:', newTheme === 'dark');

  };

  // Helper: apply theme CSS variables to :root/documentElement
  const applyThemeVariables = (themeName) => {
    if (typeof document === 'undefined' || !document.documentElement) return;
    if (themeName === 'dark') {
      document.documentElement.style.setProperty('--bg-color', '#071226');
      document.documentElement.style.setProperty('--text-color', '#e6eef8');
      document.documentElement.style.setProperty('--card-bg', '#082033');
      document.documentElement.style.setProperty('--muted', '#94a3b8');
      document.documentElement.style.setProperty('--panel-bg', '#071826');
      document.documentElement.style.setProperty('--border-color', 'rgba(148,163,184,0.18)');
    } else {
      document.documentElement.style.setProperty('--bg-color', '#ffffff');
      document.documentElement.style.setProperty('--text-color', '#111827');
      document.documentElement.style.setProperty('--card-bg', '#ffffff');
      document.documentElement.style.setProperty('--muted', '#6b7280');
      document.documentElement.style.setProperty('--panel-bg', '#f8fafc');
      document.documentElement.style.setProperty('--border-color', 'rgba(203,213,225,0.6)');
    }
  };

  const updatePrimaryColor = (color) => {
    setPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
    // Update CSS variables if needed
    document.documentElement.style.setProperty('--primary-color', color);
  };

  const value = {
    theme,
    primaryColor,
    toggleTheme,
    updatePrimaryColor,
    isDark: theme === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};