import { Moon, Sun, SunMoon } from 'lucide-react';

import { Button } from './ui/button';

import { Theme, useTheme } from '../providers/ThemeProvider';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const themeOptions: Theme[] = ['light', 'dark', 'system'];

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => {
        const nextTheme =
          themeOptions[(themeOptions.indexOf(theme) + 1) % themeOptions.length];
        setTheme(nextTheme);
      }}
    >
      {theme === 'light' ? (
        <Sun size={20} />
      ) : theme === 'dark' ? (
        <Moon size={20} />
      ) : (
        <SunMoon size={20} />
      )}
    </Button>
  );
};

export default ThemeToggle;
