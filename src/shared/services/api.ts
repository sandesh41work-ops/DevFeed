import axios from "axios";
import { Story } from "../types/story";

const apiClient = axios.create({
    baseURL: 'https://hacker-news.firebaseio.com/v0',
    timeout: 10000,
})

export const getTopStories = async (): Promise<number[]> => {
    const response = await apiClient.get('/topstories.json')
    console.log("API Call ::: /topstories :::")
    console.log("Number of top stories:", response.data.length);
    return response.data;
}

export const getStory = async (id: number) => {
    const response = await apiClient.get(`/item/${id}.json`)
    //  console.log("API Call ::: /item/:id ::: ", id)
    // console.log("Story data:", response.data)
    return response.data
}