import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDarkTheme, setIsDarkTheme] = useState(systemColorScheme === 'dark');

    useEffect(() => {
        const loadThemeSetting = async () => {
            const savedDarkMode = await SecureStore.getItemAsync('dark-mode');
            if (savedDarkMode !== null) {
                setIsDarkTheme(JSON.parse(savedDarkMode));
            }
        };
        loadThemeSetting();
    }, []);

    const toggleTheme = async () => {
        const newTheme = !isDarkTheme;
        setIsDarkTheme(newTheme);
        await SecureStore.setItemAsync('dark-mode', JSON.stringify(newTheme));
    };

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
export default ThemeProvider;

export const useTheme = () => useContext(ThemeContext);
