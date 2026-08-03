import { useQuery } from '@tanstack/react-query'
import { getAskStories, getBestStories, getJobStories, getNewStories, getShowStories, getTopStories } from '../../shared/services/hackerNewsServices'
import {Feed} from '../../shared/types/feed'

export const getStories = (feed: Feed) => {
  switch (feed) {
    case "top":
      return getTopStories();

    case "new":
      return getNewStories();

    case "best":
      return getBestStories();

    case "ask":
      return getAskStories();

    case "show":
      return getShowStories();

    case "jobs":
      return getJobStories();

    default:
      return getTopStories();
  }
};

export const useStoriesQuery = (selectedFeed : Feed) => {
  return useQuery({
   queryKey: ["stories", selectedFeed],
    queryFn: () => getStories(selectedFeed),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  })
}