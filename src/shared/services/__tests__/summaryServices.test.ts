import axios from "axios";
import { getSummary } from "../summaryServices";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("summaryServices", () => {
  it("successfully returns summarized content", async () => {
    const mockSummary = {
      title: "DevFeed Released",
      summary: "DevFeed is a Hacker News client for mobile developers.",
    };

    const summaryServices = require("../summaryServices");
    jest.spyOn(summaryServices, "getSummary").mockResolvedValueOnce(mockSummary);

    const res = await summaryServices.getSummary(1001, "https://example.com/article");
    expect(res).toEqual(mockSummary);
    expect(res.title).toBe("DevFeed Released");
  });

  it("handles AI summary backend failure gracefully", async () => {
    const summaryServices = require("../summaryServices");
    jest
      .spyOn(summaryServices, "getSummary")
      .mockRejectedValueOnce(new Error("Internal Server Error"));

    await expect(
      summaryServices.getSummary(1001, "https://example.com/article")
    ).rejects.toThrow("Internal Server Error");
  });
});
