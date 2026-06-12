import AsyncStorage from "@react-native-async-storage/async-storage";
import { Story } from "../types/story";

const BOOKMARKS_KEY = "bookmarks";

export const getBookmarks = async (): Promise<Story[]> => {
    const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
    // const parsedData = data ? JSON.parse(data) : [];
    // const titles = parsedData.map((story) : Story  => story.title);
    // titles.forEach(title => {
    //     console.log(title)
    // });
    return data ? JSON.parse(data) : []
}
export const addBookmark = async (story: Story): Promise<void> => {
    const bookmarks = await getBookmarks();
    const updated = [...bookmarks, story];
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));

}
export const removeBookmark = async (storyId: number): Promise<void> => {
    const bookmarks = await getBookmarks();
    const updated = bookmarks.filter(b => b.id !== storyId);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
}
export const isBookmarked = async (storyId: number): Promise<boolean> => {
    const bookmarks = await getBookmarks()
    return bookmarks.some(b => b.id === storyId)
}