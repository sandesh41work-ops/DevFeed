
import { useQuery } from "@tanstack/react-query";
import { getStory } from "../../shared/services/hackerNewsServices";

export const useStoryQuery = (id: number) => {
  return useQuery({
    queryKey: ["story", id],
    queryFn: () => getStory(id),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};