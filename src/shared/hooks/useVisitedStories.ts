// hook for managing visited stories. 

import { useEffect, useState } from "react";
import { getVisitedStories } from "../services/visitedStories";

export function useVisitedStories() {
  const [visitedStories, setVisitedStories] = useState(new Set<number>());

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const ids = await getVisitedStories();
    setVisitedStories(new Set(ids));
  }

  return {
    visitedStories,
    reload: load,
  };
}