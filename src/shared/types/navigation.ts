import { Story } from "./story"

export type RootStackParamList = {
  MainTabs: undefined; // This will hold our Tab Navigator,
  Login: undefined
  Home: undefined
  SignUp: undefined
  ArticleDetail: { story: Story }
  AskDetail: { story: Story }
  ArticleWebView: { url: string; title?: string }
  Profile : undefined
}
export type TabParamList = {
  Feed: undefined;
  Bookmarks: undefined;
};