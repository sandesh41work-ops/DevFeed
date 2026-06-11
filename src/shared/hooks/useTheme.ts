import { useColorScheme } from 'react-native'

export const useTheme = () => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  // console.log("Theme:", colorScheme);

  return {
    isDark,
    colors: {
      background: isDark ? '#1a1a1a' : '#F4F4F4',
      card: isDark ? '#2a2a2a' : '#ffffff',
      text: isDark ? '#ffffff' : '#222222',
      subtext: isDark ? '#aaaaaa' : '#555555',
      border: isDark ? '#333333' : '#eeeeee',
      accent: '#FF6600', // Hacker News orange — same in both modes
      skeleton: isDark ? '#3a3a3a' : '#E0E0E0',
    }
  }
}