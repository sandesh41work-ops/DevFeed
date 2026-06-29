import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const summaryClient = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
  },
});

export type SummaryResponse = {
  title: string;
  summary: string[];
};

export const getSummary = async (
  articleId: number,
  url: string,
): Promise<SummaryResponse> => {
  const { data } = await summaryClient.post<SummaryResponse>("/summarize", {
    articleId,
    url,
  });

  return data;
};
