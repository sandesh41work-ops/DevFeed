import { useQuery } from "@tanstack/react-query";
import { getSummary } from "../../shared/services/summaryServices";

export const useSummaryQuery = (
  articleId: number,
  url: string,
  options?: {
    enabled?: boolean;
  },
) => {
  return useQuery({
    queryKey: ["summary", articleId],
    queryFn: () => getSummary(articleId, url),
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: options?.enabled ?? true,
  });
};
