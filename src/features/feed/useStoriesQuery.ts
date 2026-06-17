import { useQuery } from '@tanstack/react-query'
import { getTopStories } from '../../shared/services/api'

export const useStoriesQuery = () => {
  return useQuery({
    queryKey: ['topStories'],
    queryFn: getTopStories,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  })
}