// CONST vars
// -----------
export const holes = {
  nine: 9,
  eighteen: 18,
} as const;

export const parTypes = {
  three: 3,
  four: 3,
  five: 5,
} as const;

export const NINE_HOLES = {
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

export type TNINE_HOLES = typeof NINE_HOLES;

export type NineHoleKey = keyof typeof NINE_HOLES;

export const EIGHTEEN_HOLES = {
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

export type TEIGHTEEN_HOLES = typeof EIGHTEEN_HOLES;

export const NINE_HOLES_MAP = [
  "hole_one",
  "hole_two",
  "hole_three",
  "hole_four",
  "hole_five",
  "hole_six",
  "hole_seven",
  "hole_eight",
  "hole_nine",
] as const;

export type T9_MAP = typeof NINE_HOLES_MAP;

export const EIGHTEEN_HOLES_MAP = [
  "hole_one",
  "hole_two",
  "hole_three",
  "hole_four",
  "hole_five",
  "hole_six",
  "hole_seven",
  "hole_eight",
  "hole_nine",
  "hole_ten",
  "hole_eleven",
  "hole_twelve",
  "hole_thirteen",
  "hole_fourteen",
  "hole_fifteen",
  "hole_sixteen",
  "hole_seventeen",
  "hole_eighteen",
] as const;
export type T18_MAP = typeof EIGHTEEN_HOLES_MAP;

export const NINE_ARRAY = Object.values(NINE_HOLES);
export const EIGHTEEN_ARRAY = Object.values(EIGHTEEN_HOLES);

// TYPES
// -----------
export type THoles = 9 | 18;

// nine hole card
export type nine_hole_card = {
  hole_one: number;
  hole_two: number;
  hole_three: number;
  hole_four: number;
  hole_five: number;
  hole_six: number;
  hole_seven: number;
  hole_eight: number;
  hole_nine: number;
};

// eighteen hole card
export type eighteen_hole_card = {
  hole_one: number;
  hole_two: number;
  hole_three: number;
  hole_four: number;
  hole_five: number;
  hole_six: number;
  hole_seven: number;
  hole_eight: number;
  hole_nine: number;
  hole_ten: number;
  hole_eleven: number;
  hole_twelve: number;
  hole_thirteen: number;
  hole_fourteen: number;
  hole_fifteen: number;
  hole_sixteen: number;
  hole_seventeen: number;
  hole_eighteen: number;
};

export type TparTypes = 3 | 4 | 5;

// INTERFACES
// ------------
export interface ICourse<TScoreCard = nine_hole_card | eighteen_hole_card> {
  club_name: string;
  holes: THoles;
  par: number;
  location: string;
  course_name: string | null;
  score_card: TScoreCard;
}

export interface ICourseView {
  id: number;
  club_name: string;
  holes: THoles;
  par: number;
  location: string;
  course_name: string | null;
}
