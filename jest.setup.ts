// Global Jest setup for React Native / Expo environment
import "@testing-library/react-native";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
);

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock expo-notifications
jest.mock("expo-notifications", () => ({
  AndroidImportance: {
    DEFAULT: 3,
    HIGH: 4,
    MAX: 5,
  },
  SchedulableTriggerInputTypes: {
    DATE: "date",
    TIME_INTERVAL: "timeInterval",
    DAILY: "daily",
  },
  getPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  requestPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  setNotificationChannelAsync: jest.fn(async () => {}),
  scheduleNotificationAsync: jest.fn(async () => "mock-notification-id-" + Math.random().toString(36).substring(7)),
  cancelScheduledNotificationAsync: jest.fn(async () => {}),
  getAllScheduledNotificationsAsync: jest.fn(async () => []),
  setNotificationHandler: jest.fn(),
}));

// Mock expo-splash-screen
jest.mock("expo-splash-screen", () => ({
  hideAsync: jest.fn(async () => {}),
  preventAutoHideAsync: jest.fn(async () => {}),
}));

// Mock expo-observe
jest.mock("expo-observe", () => ({
  Observe: {
    configure: jest.fn(),
  },
  useObserve: () => ({
    markInteractive: jest.fn(),
  }),
  ObserveRoot: {
    wrap: (component: any) => component,
  },
}));

// Mock Firebase Auth
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn(),
  onAuthStateChanged: jest.fn(() => () => {}),
}));

// Mock internal firebase service
jest.mock("./src/shared/services/firebase", () => ({
  auth: {
    currentUser: {
      uid: "test-uid-123",
      email: "test@example.com",
      displayName: "Test User",
      reload: jest.fn(async () => {}),
    },
    signOut: jest.fn(async () => {}),
  },
}));
