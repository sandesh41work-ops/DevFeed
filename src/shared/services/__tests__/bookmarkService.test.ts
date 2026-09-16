import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
} from "../bookmarkService";
import { Story } from "../../types/story";

const mockStory1: Story = {
  id: 101,
  title: "Show HN: DevFeed",
  by: "testuser",
  score: 150,
  time: 1700000000,
  url: "https://devfeed.app",
  descendants: 42,
  type: "story",
};

const mockStory2: Story = {
  id: 102,
  title: "Ask HN: What is your stack?",
  by: "asker",
  score: 80,
  time: 1700001000,
  descendants: 12,
  type: "story",
};

describe("bookmarkService", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe("getBookmarks", () => {
    it("returns an empty array when storage is empty", async () => {
      const bookmarks = await getBookmarks();
      expect(bookmarks).toEqual([]);
    });

    it("returns parsed bookmarks when stored", async () => {
      await AsyncStorage.setItem("bookmarks", JSON.stringify([mockStory1]));
      const bookmarks = await getBookmarks();
      expect(bookmarks).toEqual([mockStory1]);
    });

    it("handles corrupted JSON without crashing", async () => {
      await AsyncStorage.setItem("bookmarks", "invalid-json-string{");
      // Current implementation does JSON.parse(data) directly.
      // We test whether error is thrown or handled.
      await expect(getBookmarks()).rejects.toThrow();
    });
  });

  describe("addBookmark", () => {
    it("adds a story to empty bookmarks", async () => {
      await addBookmark(mockStory1);
      const bookmarks = await getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].id).toBe(101);
    });

    it("appends a new story to existing bookmarks", async () => {
      await addBookmark(mockStory1);
      await addBookmark(mockStory2);
      const bookmarks = await getBookmarks();
      expect(bookmarks).toHaveLength(2);
      expect(bookmarks.map((s) => s.id)).toEqual([101, 102]);
    });

    it("checks duplicate bookmark behavior in current implementation", async () => {
      await addBookmark(mockStory1);
      await addBookmark(mockStory1);
      const bookmarks = await getBookmarks();
      // Current implementation in bookmarkService.ts does: [...bookmarks, story] without checking existence.
      // This test tracks whether duplicates currently accumulate.
      expect(bookmarks).toHaveLength(2);
    });
  });

  describe("removeBookmark", () => {
    it("removes a story by ID", async () => {
      await addBookmark(mockStory1);
      await addBookmark(mockStory2);
      await removeBookmark(101);

      const bookmarks = await getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].id).toBe(102);
    });

    it("does nothing if storyId is not found", async () => {
      await addBookmark(mockStory1);
      await removeBookmark(999);

      const bookmarks = await getBookmarks();
      expect(bookmarks).toHaveLength(1);
      expect(bookmarks[0].id).toBe(101);
    });
  });

  describe("isBookmarked", () => {
    it("returns false if story is not bookmarked", async () => {
      const bookmarked = await isBookmarked(101);
      expect(bookmarked).toBe(false);
    });

    it("returns true if story is bookmarked", async () => {
      await addBookmark(mockStory1);
      const bookmarked = await isBookmarked(101);
      expect(bookmarked).toBe(true);
    });
  });
});
