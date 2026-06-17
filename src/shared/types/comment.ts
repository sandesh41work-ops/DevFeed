export type Comment = {
  id: number;
  by?: string;
  text?: string;
  time?: number;
  kids?: number[];
  parent?: number;
  deleted?: boolean;
  dead?: boolean;
}