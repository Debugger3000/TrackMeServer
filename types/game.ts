import type {
  eighteen_hole_card,
  ICourse,
  ICourseGameReturn,
  ICourseView,
  nine_hole_card,
  THoles,
} from "./course";
import type { IShot, IShotContact, IShotPaths, IShotType } from "./shots";

export interface ICreate_Game_Return {
  success: true;
  message: string;
  id: string;
}

export const GAME_STATUS = {
  in_progress: "IN-PROGRESS",
  complete: "COMPLETE",
} as const;

export type Status = "IN-PROGRESS" | "COMPLETE";

type Coordinates = {
  longitude: number;
  latitude: number;
};
export type Land_Type =
  | "fairway"
  | "rough"
  | "green"
  | "bunker"
  | "OB"
  | "land_hazard"
  | "water_hazard";

//   export interface IShotGame {
//     game_id: number;
//     userId: number;
//     hole: number;
//     clubType: IShotType;
//     shotContact: IShotContact;
//     shotPath: IShotPaths;
//     start_coordinates: Coordin | null;
//     end_coorindates: Coordinates | null;
//     land_type: Land_Type;
//     yards: number | null;
//     metres: number | null;
//   }

// each individual golf shot
// ishot data will need to be expanded out for this game_shot_data table in SQL
export type Game_Shot_Data = {
  hole_id: number;
  user_id: number;
  shot_count: number;
  shot: IShot;
  start_coordinates: Coordinates | null;
  end_coorindates: Coordinates | null;
  land_type: Land_Type;
  yards: number | null;
  metres: number | null;
};

export type Game_Shot_Data_Submit = {
  hole_id: number;
  user_id: number;
  game_id: number;
  shot_count: number;
  club_type: IShotType | undefined;
  shot_contact: IShotContact;
  shot_path: IShotPaths;
  start_lat: number | null;
  start_lng: number | null;
  end_lat: number | null;
  end_lng: number | null;
  land_type: Land_Type | null;
  stroke: number;
  yards: number | null;
  metres: number | null;
};

// each individual hole data
// grabs data from 'courses' like PAR + HOLE_NUMBER
export type Hole_Data = {
  id: number;
  game_id: number;
  user_id: number;
  hole_number: number;
  putt_count: number;
  par: number;
  score: number;
  notes: string | null;
  hole_shot_data: Game_Shot_Data[] | null;
};

export type Nine_Hole_Data = {
  hole_one: Hole_Data;
  hole_two: Hole_Data;
  hole_three: Hole_Data;
  hole_four: Hole_Data;
  hole_five: Hole_Data;
  hole_six: Hole_Data;
  hole_seven: Hole_Data;
  hole_eight: Hole_Data;
  hole_nine: Hole_Data;
};

export type Eighteen_Hole_Data = {
  hole_one: Hole_Data;
  hole_two: Hole_Data;
  hole_three: Hole_Data;
  hole_four: Hole_Data;
  hole_five: Hole_Data;
  hole_six: Hole_Data;
  hole_seven: Hole_Data;
  hole_eight: Hole_Data;
  hole_nine: Hole_Data;
  hole_ten: Hole_Data;
  hole_eleven: Hole_Data;
  hole_twelve: Hole_Data;
  hole_thirteen: Hole_Data;
  hole_fourteen: Hole_Data;
  hole_fifteen: Hole_Data;
  hole_sixteen: Hole_Data;
  hole_seventeen: Hole_Data;
  hole_eighteen: Hole_Data;
};

// type Nine_Hole_Data = {
//   front_nine: Front_Hole_Data;
// };

// type Eighteen_Hole_Data = {
//   front_nine: Front_Hole_Data;
//   back_nine: Back_Hole_Data;
// };

// This should hold game data, hole by hole data (shots,puts) + total par
export interface IGame<
  T_Hole_Type = Nine_Hole_Data | Eighteen_Hole_Data,
  TScore_card_type = nine_hole_card | eighteen_hole_card
> {
  id: number;
  course: ICourseView;
  user_id: number;
  course_score_card: TScore_card_type;
  status: Status;
  date: string;
  score: number;
  hole_data: T_Hole_Type;
  hole_state: number | null;
  notes: string | null;
}

export interface IGameObjectReturn {
  id: number;
  course: ICourseGameReturn;
  user_id: number;
  status: Status;
  date: string;
  score: number;
  hole_state: number | null;
  notes: string | null;
}

export interface IGameReturnNine {
  game_object: IGameObjectReturn;
  score_card_data: nine_hole_card;
  hole_data: Nine_Hole_Data;
}

export interface IGameReturnEight {
  game_object: IGameObjectReturn;
  score_card_data: eighteen_hole_card;
  hole_data: Eighteen_Hole_Data;
}

export interface IGameView {
  id: number;
  course_id: number;
  user_id: number;
  status: Status;
  created_at: string;
  score: number;
  club_name: string;
  par: number;
  holes: number;
}

// ----------------

// flip type for when its either 9 or 18 holes for incoming data from DATABASE
export type MainGameData<H extends THoles> = H extends 18
  ? IGameMainCall<eighteen_hole_card>
  : IGameMainCall<nine_hole_card>;

// ----

// game data - Game + course + score_card
export interface IGameBase {
  club_name: string;
  holes: THoles;
  par: number;
  location: string;
  course_name: string | null;
  id: number;
  user_id: number;
  course_id: number;

  status: Status;
  date: string;
  score: number;
  hole_state: number | null;
  notes: string | null;
  created_at: string;
}

// Game + Course + Scorecard data MAIN
export type IGameMainCall<
  TScore_card_type = nine_hole_card | eighteen_hole_card
> = IGameBase & TScore_card_type;

// create all hole data for game row after creation

export type ICreateHoles<
  TScore_card_type = nine_hole_card | eighteen_hole_card
> = TScore_card_type;

export type Hole_Data_getter = {
  id: number;
  game_id: number;
  hole_id: number;
  user_id: number;
  hole_number: number;
  putt_count: number;
  par: number;
  score: number;
  notes: string | null;
};

// do i build a whole game object when game is created ? YES

// build hole per entry into HOLE, complete a hole to move to next hole, CREATE next HOLE, once at end

// create shot when a SHOt is added on hole, PUTTs must be chosen before hole can be complete (0,1,2,3,4,5,6) ??
// shots are saved when added
// notes can be filled in, optional

// hole data is saved when COMPLETE is clicked...

// Last hole, will say COMPLETE GAME, then hole is saved, and game is completed, and status is changed to 'COMPLETE'

export type Hole_Submit = {
  id: number;
  putt_count: number;
  score: number;
  notes: string | null;
  game_id: number;
  hole_state: number;
  game_score: number;
};

export type Game_Shot_Delete = {
  hole_id: number;
  user_id: number;
  game_id: number;
  shot_count: number;
};
