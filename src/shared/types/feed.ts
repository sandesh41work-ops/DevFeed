export const FEEDS = [
  {
    id: 'top',
    label: 'Top',
  },
  {
    id: 'new',
    label: 'New',
  },
  {
    id: 'best',
    label: 'Best',
  },
  {
    id: 'ask',
    label: 'Ask',
  },
  {
    id: 'show',
    label: 'Show',
  },
  {
    id: 'jobs',
    label: 'Jobs',
  },
] as const;


export type Feed = (typeof FEEDS)[number]['id'];