// functions to help calculate some stats on game stats when gathered...

import type { IGameView } from "../types/game";
import type { IGame_Shots_Stats, IHole_Stats } from "../types/game-stats";
import {
  SHOTCONTACT,
  SHOTPATH,
  type IShotContact,
  type IShotContactIncoming,
  type IShotIncoming,
  type IShotType,
} from "../types/shots";

// GAMES tab
// Games Played
// scoring average = total strokes / rounds played
// average putt count

// fairways hit (grab shot 1's and see how many on fairway vs not...)
// Eagle / Birdie / par / bogey / double or greater percentages

// longest drive

// score averages on par 3s, par 4s, and par 5s...

// club performances
// strokes, landings, distance average, paths...
// 2 strokes penalties for specific club

// comparison between land types
// fairways vs rough vs sand vs ob

export function getScoringAverage(games: IGameView[], games_played: number) {
  let total_score = 0;
  let total_score_adjusted = 0;
  for (let i = 0; i < games_played; i++) {
    const score = games[i]?.score;
    if (score) {
      total_score = total_score + score;

      const par = games[i]?.par;
      if (par) {
        total_score_adjusted = total_score_adjusted + (par + score);
      }
    }
  }

  return {
    stroke_score: Math.round((total_score / games_played) * 10) / 10,
    par_score: Math.round((total_score_adjusted / games_played) * 10) / 10,
  };
}

export function getAveragePutts(holes: IHole_Stats[], holes_count: number) {
  let total_putts = 0;
  for (let i = 0; i < holes_count; i++) {
    const putt_count = holes[i]?.putt_count;
    if (putt_count) {
      total_putts = total_putts + putt_count;
    }
  }

  return Math.round((total_putts / holes_count) * 10) / 10;
}

export type TGame_scores_distro = {
  eagle: number;
  birdie: number;
  par: number;
  bogey: number;
  double_or_more: number;
};

export function tallyHoleScores(holes: IHole_Stats[], holes_count: number) {
  let hole_scores: TGame_scores_distro = {
    eagle: 0,
    birdie: 0,
    par: 0,
    bogey: 0,
    double_or_more: 0,
  };

  // console.log("holes in tally: ", holes);

  // console.log("hole count: ", holes_count);

  for (let i = 0; i < holes_count; i++) {
    // const putt_count = holes[i]?.putt_count;
    // if (putt_count) {
    //   total_putts = total_putts + putt_count;
    // }
    const hole_score = holes[i]?.score;
    const hole_par = holes[i]?.par;

    if (hole_score && hole_par) {
      const diff = hole_score - hole_par;
      // console.log("'diff before switch: ", diff);

      // if (!diff) {
      //   return;
      // }

      if (diff <= -2) {
        // Eagle (includes -4, -3, -2)
        hole_scores.eagle++;
      } else if (diff === -1) {
        // Birdie
        hole_scores.birdie++;
      } else if (diff === 0) {
        // Par
        hole_scores.par++;
      } else if (diff === 1) {
        // Bogey
        hole_scores.bogey++;
      } else {
        // Double bogey or worse
        hole_scores.double_or_more++;
      }
    }
  }
  // console.log("hole scorses: ", hole_scores);
  return hole_scores;
}

// return percent of shot ones that hit the fairway
export function getFairwaysHit(
  shots: IGame_Shots_Stats[],
  total_shots: number
) {
  let longest_drive = 0;

  let total_fairways_hit = 0;
  let total_first_shots = 0;
  for (let i = 0; i < total_shots; i++) {
    const shot_count = shots[i]?.shot_count;
    if (shot_count && shot_count === 1) {
      total_first_shots++;
      const land_type = shots[i]?.land_type;
      if (land_type) {
        if (land_type === "fairway") {
          total_fairways_hit++;
        }
      }
    }
    const club = shots[i]?.club_type;
    const yards = shots[i]?.yards;
    if (yards && club && club === "Dr") {
      if (yards > longest_drive) {
        longest_drive = yards;
      }
    }
  }

  return {
    fairways: Math.round((total_fairways_hit / total_first_shots) * 10) / 10,
    driver: longest_drive,
  };
}

export function penaltyTaken(shots: IGame_Shots_Stats[], total_shots: number) {
  let total_penalty_strokes = 0;
  for (let i = 0; i < total_shots; i++) {
    const stroke = shots[i]?.stroke;
    if (stroke && stroke === 2) {
      total_penalty_strokes++;
    }
  }

  return Math.round((total_penalty_strokes / total_shots) * 10) / 10;
}

// ----------------------
// get average club distance
export function getAverageClubDistance(
  shots: IGame_Shots_Stats[],
  total_shots: number
) {
  let longest_shot = 0;
  let total_distance = 0;
  for (let i = 0; i < total_shots; i++) {
    const yards = shots[i]?.yards;
    if (yards) {
      total_distance++;
      if (yards > longest_shot) {
        longest_shot = yards;
      }
    }
  }

  return {
    average_distance: Math.round((total_distance / total_shots) * 10) / 10,
    longest_shot: longest_shot,
  };
}

// map game shots to shot paths array
export function mapShotsToArray(
  shots: IGame_Shots_Stats[],
  club_type: IShotType
): IShotIncoming {
  // Get the keys in the order you want
  const paths = Object.values(SHOTPATH) as (keyof typeof SHOTPATH)[];

  // Initialize counts array
  const counts: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ] = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  // Loop through each shot and increment the corresponding index
  for (const shot of shots) {
    const idx = paths.indexOf(shot.shot_path as keyof typeof SHOTPATH);
    if (idx !== -1) {
      counts[idx]!++;
    }
  }

  return { clubType: club_type, dataSet: counts };
}

export function mapShotContactsToArray(
  shots: IGame_Shots_Stats[],
  total: number
): IShotContactIncoming {
  // Get the contact keys in the correct order
  const contacts = Object.values(SHOTCONTACT) as IShotContact[];

  // Initialize counts array
  const counts: [number, number, number, number, number] = [0, 0, 0, 0, 0];

  // Loop through each shot and increment the corresponding index
  for (const shot of shots) {
    const idx = contacts.indexOf(shot.shot_contact);
    if (idx !== -1) {
      counts[idx]!++;
    }
  }

  return { total: total, dataSet: counts };
}
