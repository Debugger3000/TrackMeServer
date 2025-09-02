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
  PullHook: "pullHook",
  Hook: "hook",
  Pull: "pull",
  Draw: "draw",
  Straight: "straight",
  Fade: "fade",
  Push: "push",
  Slice: "slice",
  PushSlice: "pushSlice",
} as const;

export const SHOTPATH_ITER: string[] = Object.values(SHOTPATH);
export const SHOTPATH_POP: number[] = Array(9).fill(0);

export const SHOTCONTACT = {
  Center: "center",
  Fat: "fat",
  Thin: "thin",
  Toe: "toe",
  Heel: "heel",
} as const;

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

// Shot Shape SVG
// ---------------------------------------------
export const SHOTPATHSVG = {
  straight: {
    d: "M100,380 C100,300 100,200 100,75",
    class: "straight",
  },
  fade: {
    d: "M100,380 C120,50 150,10 100,145",
    class: "fade",
  },
  draw: {
    d: "M100,380 C65,50 70,10 100, 145",
    class: "draw",
  },
  push: {
    d: "M100,380 C125,50 150,5 140, 145",
    class: "push",
  },
  pull: {
    d: "M100,380 C75,50 50,5 60,145",
    class: "pull",
  },
  slice: {
    d: "M100,380 C25,200 10,10 160,145",
    class: "slice",
  },
  pushSlice: {
    d: "M100,380 C110,50 130,75 180,145",
    class: "push-slice",
  },
  hook: {
    d: "M100,380 C175,200 190,10 40,145",
    class: "hook",
  },
  pullHook: {
    d: "M100,380 C90,50 70,75 20,145",
    class: "pull-hook",
  },
};
