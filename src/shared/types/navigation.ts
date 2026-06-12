import { Story } from "./story"

export type RootStackParamList = {
  Login: undefined
  Home: undefined
  SignUp : undefined
  ArticleDetail: { story: Story }
}
export type TabParamList = {
  Feed: undefined;
  Bookmarks: undefined;
};