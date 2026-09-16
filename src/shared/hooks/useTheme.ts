import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storage";

export type ThemeMode = "system" | "light" | "dark";

export type ThemeColors = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  accent: string;
  skeleton: string;
  error: string;
};

export type ThemeContextType = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  isDark: boolean;
  colors: ThemeColors;
};

const getThemeColors = (isDark: boolean): ThemeColors => ({
  background: isDark ? "#1a1a1a" : "#F4F4F4",
  card: isDark ? "#2a2a2a" : "#ffffff",
  text: isDark ? "#ffffff" : "#222222",
  subtext: isDark ? "#aaaaaa" : "#555555",
  border: isDark ? "#333333" : "#eeeeee",
  accent: "#FF6600", // Hacker News orange — same in both modes
  skeleton: isDark ? "#3a3a3a" : "#E0E0E0",
  error: isDark ? "#FF6B6B" : "#B00020",
});

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEYS.THEME_MODE)
      .then((stored) => {
        if (stored === "system" || stored === "light" || stored === "dark") {
          setThemeModeState(stored);
        }
      })
      .catch((err) => {
        console.warn("Failed to load theme preference", err);
      });
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    } catch (err) {
      console.warn("Failed to save theme preference", err);
    }
  };

  const isDark =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  const colors = useMemo(() => getThemeColors(isDark), [isDark]);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      isDark,
      colors,
    }),
    [themeMode, isDark, colors]
  );

  return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context) {
    return context;
  }

  // Fallback if rendered outside ThemeProvider
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === "dark";
  return {
    themeMode: "system",
    setThemeMode: async () => {},
    isDark,
    colors: getThemeColors(isDark),
  };
};