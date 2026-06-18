import { useQuery } from "@tanstack/react-query";
import { getStory } from "../../shared/services/api";

export const useCommentsQuery = (commentIds: number[]) => {
  return useQuery({
    enabled: commentIds.length > 0,

    queryKey: ["comments", commentIds],

    queryFn: async () => {
      return Promise.all(commentIds.map(getStory));
    },
  });
};
