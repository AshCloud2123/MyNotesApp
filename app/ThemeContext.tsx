import React, { createContext, useContext, useState, ReactNode } from 'react';

const lightColors = {
  background: '#f4f6fb',
  card: '#fff',
  text: '#222',
  primary: '#4f8cff',
  input: '#fff',
  subtitle: '#888',
  error: 'red',
  buttonText: '#fff',
  link: '#4f8cff',
};

const darkColors = {
  background: '#181a20',
  card: '#23262f',
  text: '#fff',
  primary: '#4f8cff',
  input: '#23262f',
  subtitle: '#aaa',
  error: '#ff6b6b',
  buttonText: '#fff',
  link: '#4f8cff',
};

type ThemeType = 'light' | 'dark';

const ThemeContext = createContext<{
  theme: ThemeType;
  colors: typeof lightColors;
  toggleTheme: () => void;
}>({
  theme: 'light',
  colors: lightColors,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('light');
  const colors = theme === 'dark' ? darkColors : lightColors;

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}