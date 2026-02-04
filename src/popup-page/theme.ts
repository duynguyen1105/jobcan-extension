import 'styled-components'

export interface ThemeColors {
  formBackground: string
  formShadow: string
  labelText: string
  inputBorder: string
  inputBackground: string
  inputText: string
  focusBorder: string
  buttonText: string
  buttonBackground: string
  buttonHover: string
  toastBackground: string
  toastText: string
  toastBorder: string
  selectBackground: string
  colorScheme: string
}

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeColors {}
}

export const lightTheme: ThemeColors = {
  formBackground: '#f9f9f9',
  formShadow: 'rgba(0, 0, 0, 0.1)',
  labelText: '#333',
  inputBorder: '#ccc',
  inputBackground: '#fff',
  inputText: '#333',
  focusBorder: '#007bff',
  buttonText: '#fff',
  buttonBackground: '#0d6efd',
  buttonHover: '#0056b3',
  toastBackground: '#f8d7da',
  toastText: '#721c24',
  toastBorder: '#f5c6cb',
  selectBackground: '#fff',
  colorScheme: 'light',
}

export const darkTheme: ThemeColors = {
  formBackground: '#1e1e1e',
  formShadow: 'rgba(0, 0, 0, 0.4)',
  labelText: '#e0e0e0',
  inputBorder: '#444',
  inputBackground: '#2a2a2a',
  inputText: '#e0e0e0',
  focusBorder: '#4da3ff',
  buttonText: '#fff',
  buttonBackground: '#2979ff',
  buttonHover: '#1565c0',
  toastBackground: '#4a1c24',
  toastText: '#f8b4b4',
  toastBorder: '#6b2c35',
  selectBackground: '#2a2a2a',
  colorScheme: 'dark',
}

export type ThemeMode = 'light' | 'dark' | 'system'

export const THEME_STORAGE_KEY = 'themeMode'

export function resolveTheme(mode: ThemeMode): ThemeColors {
  if (mode === 'light') return lightTheme
  if (mode === 'dark') return darkTheme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? darkTheme : lightTheme
}
