// functions to help calculate some stats on game stats when gathered...

import type { IGameView } from "../types/game";
import type { IGame_Shots_Stats, IHole_Stats } from "../types/game-stats";

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
      if(par){
        total_score_adjusted = total_score_adjusted + (par + score);
      }

    }
  }

  return {stroke_score: Math.round((total_score / games_played) * 10) / 10, par_score: Math.round((total_score_adjusted / games_played) * 10) / 10};
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

  for (let i = 0; i < holes_count; i++) {
    // const putt_count = holes[i]?.putt_count;
    // if (putt_count) {
    //   total_putts = total_putts + putt_count;
    // }
    const hole_score = holes[i]?.score;
    const hole_par = holes[i]?.par;

    const diff = hole_score && hole_par ? hole_score - hole_par : null;

    if (!diff) {
      return;
    }

    switch (diff) {
      case -2:
        hole_scores.eagle++;
        break;
      case -1: // Birdie
        hole_scores.birdie++;
        break;
      case 0: // Par
        hole_scores.par++;
        break;
      case 1: // Bogey
        hole_scores.bogey++;
        break;
      default: // Double bogey or worse
        if (diff >= 2) {
          hole_scores.double_or_more++;
        }
        break;
    }
  }

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
