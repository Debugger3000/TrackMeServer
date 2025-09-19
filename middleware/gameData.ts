import sql from "../database/config";
import {
  EIGHTEEN_HOLES_MAP,
  holes,
  NINE_HOLES_MAP,
  type eighteen_hole_card,
  type Eighteen_Key,
  type nine_hole_card,
  type NineHoleKey,
  type T18_MAP,
  type T9_MAP,
  type THoles,
} from "../types/course";
import type { IGame, IGameBase, MainGameData } from "../types/game";

let EIGHTEEN_HOLES = {
  hole_one: 0,
  hole_two: 0,
  hole_three: 0,
  hole_four: 0,
  hole_five: 0,
  hole_six: 0,
  hole_seven: 0,
  hole_eight: 0,
  hole_nine: 0,
  hole_ten: 0,
  hole_eleven: 0,
  hole_twelve: 0,
  hole_thirteen: 0,
  hole_fourteen: 0,
  hole_fifteen: 0,
  hole_sixteen: 0,
  hole_seventeen: 0,
  hole_eighteen: 0,
};

let NINE_HOLES = {
  hole_one: 0,
  hole_two: 0,
  hole_three: 0,
  hole_four: 0,
  hole_five: 0,
  hole_six: 0,
  hole_seven: 0,
  hole_eight: 0,
  hole_nine: 0,
};

// ---------
// Get score cards

export function getScoreCardNine(data: IGameBase) {
  const score_card: nine_hole_card = NINE_HOLES;
  const hole_map: T9_MAP = NINE_HOLES_MAP;

  const data_p = data as MainGameData<9>;

  for (const key of hole_map) {
    score_card[key] = data_p[key];
  }
  return score_card;
}

export function getScoreCardEight(data: IGameBase) {
  const score_card: eighteen_hole_card = EIGHTEEN_HOLES;
  const hole_map: T18_MAP = EIGHTEEN_HOLES_MAP;

  const data_p = data as MainGameData<18>;

  for (const key of hole_map) {
    score_card[key] = data_p[key];
  }
  return score_card;
}

// ---------------------------------------

export function getCourseData(data: IGameBase) {
  const data_p = data as IGameBase;
  let course_data: parse_course = {
    club_name: data_p.club_name,
    location: data_p.location,
    par: data_p.par,
    holes: data_p.holes,
    course_name: data_p.course_name,
  };

  return course_data;
}

const course_map = ["club_name", "location", "course_name"] as const;

type parse_course = {
  club_name: string;
  location: string;
  par: number;
  holes: THoles;
  course_name: string | null;
};

// -------------------- query for nine or eighteen holes...
export async function getGameObjectNine(game_id: string) {
  try {
    const result = await sql<IGameBase[]>`SELECT 
    g.id,
    g.user_id,
    g.course_id,
    g.status,
    g.score,
    g.par,
    g.holes,
    g.hole_state,
    g.notes,
    g.created_at,
    c.club_name,
    c.course_name,
    c.location,
    sc.*
  FROM games g
  JOIN courses c 
    ON g.course_id = c.id
  JOIN nine_score_cards sc
    ON g.course_id = sc.course_id
  WHERE g.id = ${game_id}
    `;

    return result;
  } catch (error) {
    return null;
  }
}

export async function getGameObjectEight(game_id: string) {
  try {
    const result = await sql<IGameBase[]>`SELECT 
    g.id,
    g.user_id,
    g.course_id,
    g.status,
    g.score,
    g.par,
    g.holes,
    g.hole_state,
    g.notes,
    g.created_at,
    c.club_name,
    c.course_name,
    c.location,
    sc.*
  FROM games g
  JOIN courses c 
    ON g.course_id = c.id
  JOIN eighteen_score_cards sc
    ON g.course_id = sc.course_id
  WHERE g.id = ${game_id}
    `;
    return result;
  } catch (error) {
    return null;
  }
}
