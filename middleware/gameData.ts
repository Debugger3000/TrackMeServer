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
import type { MainGameData } from "../types/game";

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

export function getScoreCard(data: MainGameData<THoles>, holes: THoles) {
  if (holes === 18) {
    const score_card: eighteen_hole_card = EIGHTEEN_HOLES;
    const hole_map: T18_MAP = EIGHTEEN_HOLES_MAP;

    const data_p = data as MainGameData<typeof holes>;

    for (const key of hole_map) {
      score_card[key] = data_p[key];
    }
    return score_card;
  } else {
    const score_card: nine_hole_card = NINE_HOLES;
    const hole_map: T9_MAP = NINE_HOLES_MAP;

    const data_p = data as MainGameData<typeof holes>;

    for (const key of hole_map) {
      score_card[key] = data_p[key];
    }
    return score_card;
  }
}

export function getCourseData(data: MainGameData<THoles>, holes: THoles) {
  const data_p = data as MainGameData<typeof holes>;
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
