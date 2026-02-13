import React from 'react';
import { createTheme } from '@mui/material/styles';

const ColorModeContext = React.createContext({
  mode: 'light',
  toggle: () => {},
  theme: createTheme({ palette: { mode: 'light' } }),
});

export function ColorModeProvider({ children }) {
  const [mode, setMode] = React.useState(() => {
    try {
      return localStorage.getItem('bank_theme_mode') || 'light';
    } catch {
      return 'light';
    }
  });

  const toggle = React.useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('bank_theme_mode', next);
      } catch {}
      return next;
    });
  }, []);

  const theme = React.useMemo(() => createTheme({ palette: { mode } }), [mode]);

  const value = React.useMemo(() => ({ mode, toggle, theme }), [mode, toggle, theme]);

  return <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>;
}

export function useColorMode() {
  return React.useContext(ColorModeContext);
}
