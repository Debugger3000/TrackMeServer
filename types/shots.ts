// CONST values to use as ENUMS
// -------------------------------------------

import type { StringLiteral } from "typescript";

export const CLUBTYPE = {
  Driver: "Dr",
  ThreeWood: "3w",
  FourWood: "4w",
  FiveWood: "5w",
  OneIron: "1i",
  TwoIron: "2i",
  ThreeIron: "3i",
  FourIron: "4i",
  FiveIron: "5i",
  SixIron: "6i",
  SevenIron: "7i",
  EightIron: "8i",
  NineIron: "9i",
  GapWedge: "GW",
  PitchingWedge: "PW",
  ApproachWedge: "AW",
  FiftyFour: "54",
  FiftySix: "56",
  FiftyEight: "58",
  Sixty: "60",
} as const;

export const SHOTPATH = {
  pullHook: "pullHook",
  hook: "hook",
  pull: "pull",
  draw: "draw",
  straight: "straight",
  fade: "fade",
  push: "push",
  slice: "slice",
  pushSlice: "pushSlice",
} as const;

export const SHOTPATH_ITER: string[] = Object.values(SHOTPATH);
export const SHOTPATH_POP: number[] = Array(9).fill(0);
export const CONTACT_POP: number[] = Array(5).fill(0);

export const SHOTCONTACT = {
  center: "center",
  fat: "fat",
  thin: "thin",
  toe: "toe",
  heel: "heel",
} as const;

type ContactDataSet = [number, number, number, number, number];
export const CONTACT_ITER: string[] = Object.values(SHOTCONTACT);

// Interfaces -
// ----------------------------------
export interface IShot {
  userId: string;
  clubType: IShotType;
  shotContact: IShotContact;
  shotPath: IShotPaths;
  created_at: string;
}

// type from sql so it matches lowercase column names...
export interface IShotFromSql {
  userid: string;
  clubtype: IShotType;
  shotcontact: IShotContact;
  shotpath: IShotPaths;
  created_at: string;
}

// Types
// -------------------------------
export type IShotContact = "center" | "fat" | "thin" | "toe" | "heel";

export type IShotType =
  | "Dr"
  | "3w"
  | "4w"
  | "5w"
  | "1i"
  | "2i"
  | "3i"
  | "4i"
  | "5i"
  | "6i"
  | "7i"
  | "8i"
  | "9i"
  | "GW"
  | "PW"
  | "AW"
  | "54"
  | "56"
  | "58"
  | "60";

export type IShotPaths =
  | "straight"
  | "draw"
  | "push"
  | "slice"
  | "pushSlice"
  | "fade"
  | "pull"
  | "hook"
  | "pullHook";


  // many games shots types /  individual game shot stats
  export interface Indiv_Game_Shots {
    total_shots: number;
    average_distance: number;
    longest_shot: number;
    penalties_percent: number;
    shot_paths: IShotIncoming;
    shot_contact:  IShotContactIncoming;
  }

  export interface IShotIncoming {
  clubType: IShotType;
  dataSet: ShotDataSet;
}

// data for shot contact. Will be a donut / circle graph
export interface IShotContactIncoming {
  total: number;
  dataSet: ContactDataSet;
}



type ShotDataSet = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];