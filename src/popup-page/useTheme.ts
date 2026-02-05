import { useState, useEffect } from 'react'
import { ThemeMode, ThemeColors, THEME_STORAGE_KEY, resolveTheme } from './theme'

export function useThemeMode() {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light')
  const [resolvedTheme, setResolvedTheme] = useState<ThemeColors>(() => resolveTheme('light'))

  useEffect(() => {
    chrome.storage?.local?.get(THEME_STORAGE_KEY, (result) => {
      const saved = result[THEME_STORAGE_KEY] as ThemeMode | undefined
      if (saved) {
        setThemeModeState(saved)
        setResolvedTheme(resolveTheme(saved))
      }
    })
  }, [])

  useEffect(() => {
    if (themeMode !== 'system') return

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setResolvedTheme(resolveTheme('system'))
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [themeMode])

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode)
    setResolvedTheme(resolveTheme(mode))
    chrome.storage?.local?.set({ [THEME_STORAGE_KEY]: mode })
  }

  return { themeMode, resolvedTheme, setThemeMode }
}
