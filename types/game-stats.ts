import type { IGameView, Land_Type } from "./game";
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

// game data to return

export interface IGame_Stats {
  game_view: IGameView[];
  games_played: number;
  scoring_average: number;
  stroke_average: number;
  holes_played: number;
  total_shots: number;
  putt_average: number;
  longest_drive: number;
  fairways_hit_off_tee: number;
  penalty_percent: number;
  scores_distro: TGame_scores_distro;
}

// count up these scores, and use them in a graph... instead of grid display !
export type TGame_scores_distro = {
  eagle: number;
  birdie: number;
  par: number;
  bogey: number;
  double_or_more: number;
};

// par specific average scores

// Games Played
// scoring average = total strokes / rounds played
// average putt count

// fairways hit (grab shot 1's and see how many on fairway vs not...)
// Eagle / Birdie / par / bogey / double or greater percentages

// export interface IGameView {
//   id: number;
//   course_id: number;
//   user_id: number;
//   status: Status;
//   created_at: string;
//   score: number;
//   club_name: string;
//   par: number;
//   holes: number;
// }
