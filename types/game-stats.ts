import type { Land_Type } from "./game";
import type { IShotContact, IShotPaths, IShotType } from "./shots";

const options = ["1 month", "3 months", "6 months", "This Year", "Last Year"];

export const game_data_filter_time = {
  "1 month": "1 month",
  "3 months": "3 months",
  "6 months": "6 months",
  "1 year": "1 year",
  "last year": "1 year",
} as const;

export type TTime_Filter =
  | "1 month"
  | "3 months"
  | "6 months"
  | "1 year"
  | "1 year";

export interface IHole_Stats {
  hole_number: number;
  putt_count: number;
  par: number;
  score: number;
}

export interface IGame_Shots_Stats {
  shot_count: number;
  shot_contact: IShotContact;
  shot_path: IShotPaths;
  club_type: IShotType;
  land_type: Land_Type;
  yards: number;
  stroke: number;
}
