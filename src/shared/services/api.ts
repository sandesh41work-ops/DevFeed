import axios from "axios";

const apiClient = axios.create({
    baseURL: 'https://hacker-news.firebaseio.com/v0',
    timeout: 10000,
})

export const getTopStories = async (): Promise<number[]> => {
    const response = await apiClient.get('/topstories.json')
    console.log("API Call ::: /topstories :::")
    console.log(response.data.slice(0,20));
    return response.data.slice(0, 20)
}

export const getStory = async (id: number) => {
    const response = await apiClient.get(`/item/${id}.json`)
    console.log("API Call ::: /item/:id :::")
    console.log(response.data);
    return response.data
}