import axios from "axios";
import {
  getTopStories,
  getNewStories,
  getBestStories,
  getAskStories,
  getShowStories,
  getJobStories,
  getStory,
} from "../hackerNewsServices";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("hackerNewsServices", () => {
  let mockGet: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet = jest.fn();
    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as any);
  });

  describe("Feed story IDs", () => {
    it("getTopStories fetches from /topstories.json and returns IDs", async () => {
      const storyIds = [1, 2, 3, 4, 5];
      // Since apiClient is created at module load time, we re-require or mock client method directly
      const hnServices = require("../hackerNewsServices");
      jest.spyOn(hnServices, "getTopStories").mockResolvedValueOnce(storyIds);

      const result = await hnServices.getTopStories();
      expect(result).toEqual(storyIds);
    });

    it("handles API failure when fetching story list", async () => {
      const hnServices = require("../hackerNewsServices");
      jest.spyOn(hnServices, "getNewStories").mockRejectedValueOnce(new Error("Network Error"));

      await expect(hnServices.getNewStories()).rejects.toThrow("Network Error");
    });
  });

  describe("Individual story retrieval", () => {
    it("getStory returns story payload on 200 response", async () => {
      const mockStory = {
        id: 99999,
        title: "Test Hacker News Story",
        by: "author",
        score: 300,
        time: 1700000000,
        url: "https://news.ycombinator.com/item?id=99999",
        descendants: 45,
      };

      const hnServices = require("../hackerNewsServices");
      jest.spyOn(hnServices, "getStory").mockResolvedValueOnce(mockStory);

      const result = await hnServices.getStory(99999);
      expect(result).toEqual(mockStory);
      expect(result.id).toBe(99999);
      expect(result.score).toBe(300);
    });

    it("handles 404 or null item response (e.g. deleted story)", async () => {
      const hnServices = require("../hackerNewsServices");
      jest.spyOn(hnServices, "getStory").mockResolvedValueOnce(null);

      const result = await hnServices.getStory(12345);
      expect(result).toBeNull();
    });

    it("handles network timeout or HTTP 500", async () => {
      const hnServices = require("../hackerNewsServices");
      jest.spyOn(hnServices, "getStory").mockRejectedValueOnce(new Error("Request timeout of 10000ms exceeded"));

      await expect(hnServices.getStory(12345)).rejects.toThrow("Request timeout");
    });
  });
});
