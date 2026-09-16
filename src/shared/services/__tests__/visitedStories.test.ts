import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getVisitedStories,
  markVisitedStory,
  deleteVisitedStory,
  isStoryVisited,
} from "../visitedStories";
import { STORAGE_KEYS } from "../../constants/storage";

describe("visitedStories service", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe("getVisitedStories", () => {
    it("returns empty array when nothing has been stored", async () => {
      const visited = await getVisitedStories();
      expect(visited).toEqual([]);
    });

    it("returns array of visited IDs when present", async () => {
      await AsyncStorage.setItem(
        STORAGE_KEYS.VISITED_STORIES,
        JSON.stringify([101, 102, 103])
      );
      const visited = await getVisitedStories();
      expect(visited).toEqual([101, 102, 103]);
    });
  });

  describe("markVisitedStory", () => {
    it("adds a story ID to visited stories", async () => {
      await markVisitedStory(101);
      const visited = await getVisitedStories();
      expect(visited).toEqual([101]);
    });

    it("does not duplicate story ID if marked multiple times", async () => {
      await markVisitedStory(101);
      await markVisitedStory(101);
      const visited = await getVisitedStories();
      expect(visited).toEqual([101]);
    });

    it("appends different IDs correctly", async () => {
      await markVisitedStory(101);
      await markVisitedStory(202);
      const visited = await getVisitedStories();
      expect(visited).toEqual([101, 202]);
    });
  });

  describe("deleteVisitedStory", () => {
    it("removes a specific story ID from visited stories", async () => {
      await markVisitedStory(101);
      await markVisitedStory(202);
      await deleteVisitedStory(101);

      const visited = await getVisitedStories();
      expect(visited).toEqual([202]);
    });

    it("handles removing non-existent story ID gracefully", async () => {
      await markVisitedStory(101);
      await deleteVisitedStory(999);

      const visited = await getVisitedStories();
      expect(visited).toEqual([101]);
    });
  });

  describe("isStoryVisited", () => {
    it("returns false if story is unvisited", async () => {
      const isVisited = await isStoryVisited(101);
      expect(isVisited).toBe(false);
    });

    it("returns true if story was marked as visited", async () => {
      await markVisitedStory(101);
      const isVisited = await isStoryVisited(101);
      expect(isVisited).toBe(true);
    });
  });
});
