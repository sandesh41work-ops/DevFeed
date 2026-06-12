import { Story } from "./story"

export type RootStackParamList = {
  MainTabs: undefined; // This will hold our Tab Navigator,
  Login: undefined
  Home: undefined
  SignUp : undefined
  ArticleDetail: { story: Story }
}
export type TabParamList = {
  Feed: undefined;
  Bookmarks: undefined;
};