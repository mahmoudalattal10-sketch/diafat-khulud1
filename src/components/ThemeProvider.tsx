'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    setDarkMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleDarkMode: () => { },
    setDarkMode: () => { },
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        setMounted(true);
        try {
            const saved = localStorage.getItem('adminSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                if (settings.darkMode) {
                    setIsDarkMode(true);
                    document.documentElement.classList.add('dark');
                }
            }
        } catch (e) {
            console.error('Failed to load theme:', e);
        }
    }, []);

    // Listen for settings changes
    useEffect(() => {
        const handleStorageChange = () => {
            try {
                const saved = localStorage.getItem('adminSettings');
                if (saved) {
                    const settings = JSON.parse(saved);
                    setIsDarkMode(settings.darkMode || false);
                }
            } catch (e) {
                console.error('Failed to sync theme:', e);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Apply dark mode class to document
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        const newValue = !isDarkMode;
        setIsDarkMode(newValue);
        // Also update localStorage
        try {
            const saved = localStorage.getItem('adminSettings');
            const settings = saved ? JSON.parse(saved) : {};
            settings.darkMode = newValue;
            localStorage.setItem('adminSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save theme:', e);
        }
    };

    const setDarkModeValue = (value: boolean) => {
        setIsDarkMode(value);
        // Also update localStorage
        try {
            const saved = localStorage.getItem('adminSettings');
            const settings = saved ? JSON.parse(saved) : {};
            settings.darkMode = value;
            localStorage.setItem('adminSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save theme:', e);
        }
    };

    // Prevent flash of wrong theme
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, setDarkMode: setDarkModeValue }}>
            {children}
        </ThemeContext.Provider>
    );
}
