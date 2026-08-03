import axios from "axios";
import { Story } from "../types/story";

const apiClient = axios.create({
  baseURL: "https://hacker-news.firebaseio.com/v0",
  timeout: 10000,
});

export const getTopStories = async (): Promise<number[]> => {
  const response = await apiClient.get("/topstories.json");
  // console.log("Number of top stories:", response.data.length);
  return response.data;
};

export const getStory = async (id: number) => {
  const response = await apiClient.get(`/item/${id}.json`);
  //  console.log("API Call ::: /item/:id ::: ", id)
  // console.log("Story data:", response.data)
  return response.data;
};

export const getItem = getStory;

export const getNewStories = async (): Promise<number[]> => {
  const response = await apiClient.get("/newstories.json");
  return response.data;
};

export const getBestStories = async (): Promise<number[]> => {
  const response = await apiClient.get("/beststories.json");
  return response.data;
};
export const getAskStories = async (): Promise<number[]> => {
  const response = await apiClient.get("/askstories.json");
  return response.data;
};

export const getShowStories = async (): Promise<number[]> => {
  const response = await apiClient.get("/showstories.json");
  return response.data;
};

export const getJobStories = async (): Promise<number[]> => {
  const response = await apiClient.get("/jobstories.json");
  return response.data;
};