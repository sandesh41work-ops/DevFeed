import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../constants/storage";

export const getVisitedStories = async (): Promise<number[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEYS.VISITED_STORIES);
  return data ? JSON.parse(data) : [];
};

export const markVisitedStory = async (storyId: number): Promise<void> => {
  const visitedStories = await getVisitedStories();
  if (!visitedStories.includes(storyId)) {
    visitedStories.push(storyId);
    await AsyncStorage.setItem(
      STORAGE_KEYS.VISITED_STORIES,
      JSON.stringify(visitedStories),
    );
  }
};

export const deleteVisitedStory = async (storyId: number): Promise<void> => {
  const visitedStories = await getVisitedStories();
  const updatedStories = visitedStories.filter((id) => id !== storyId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.VISITED_STORIES,
    JSON.stringify(updatedStories),
  );
};

export const isStoryVisited = async (storyId: number): Promise<boolean> => {
  const visitedStories = await getVisitedStories();
  return visitedStories.includes(storyId);
};
