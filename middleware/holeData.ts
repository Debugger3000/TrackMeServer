import sql from "../database/config";
import {
  EIGHTEEN_HOLES_MAP,
  NINE_HOLES_MAP,
  type eighteen_hole_card,
  type nine_hole_card,
  type T18_MAP,
  type T9_MAP,
  type THoles,
} from "../types/course";
import type {
  Eighteen_Hole_Data,
  Game_Shot_Data,
  Hole_Data,
  Nine_Hole_Data,
} from "../types/game";

export async function createEightHoles(
  game_id: number,
  user_id: number,
  score_card: eighteen_hole_card
) {
  // Build values for bulk insert
  const holeValues = EIGHTEEN_HOLES_MAP.map((key, idx) => ({
    game_id: game_id,
    user_id: user_id,
    hole_number: idx + 1,
    par: score_card[key],
    putt_count: 0,
    score: 0,
    notes: null,
  }));

  // Insert all rows in one query
  const inserted = await sql`
    INSERT INTO holes ${sql(holeValues)}
    RETURNING *;
  `;
  return inserted;
}

export async function createNineHoles(
  game_id: number,
  user_id: number,
  score_card: nine_hole_card
) {
  const holeValues = NINE_HOLES_MAP.map((key, idx) => ({
    game_id: game_id,
    user_id: user_id,
    hole_number: idx + 1,
    par: score_card[key],
    putt_count: 0,
    score: 0,
    notes: null,
  }));

  // Insert all rows in one query
  const inserted = await sql`
    INSERT INTO holes ${sql(holeValues)}
    RETURNING *;
  `;
  return inserted;
}

// clean hole + shot data...
export function cleanHoleData(
  holes: THoles,
  holes_array: Hole_Data[],
  shots_array: Game_Shot_Data[]
) {
  if (holes === 9) {
    // build out nine_hole_data

    const holesWithShots: Hole_Data[] = holes_array.map((hole) => ({
      ...hole,
      hole_shot_data: shots_array.filter((s) => s.hole_id === hole.id) || null,
    }));

    if (holesWithShots) {
      const holeMap: Nine_Hole_Data = {
        hole_one: holesWithShots[0]!,
        hole_two: holesWithShots[1]!,
        hole_three: holesWithShots[2]!,
        hole_four: holesWithShots[3]!,
        hole_five: holesWithShots[4]!,
        hole_six: holesWithShots[5]!,
        hole_seven: holesWithShots[6]!,
        hole_eight: holesWithShots[7]!,
        hole_nine: holesWithShots[8]!,
      };

      return holeMap;
    }
  } else {
    const holesWithShots: Hole_Data[] = holes_array.map((hole) => ({
      ...hole,
      hole_shot_data: shots_array.filter((s) => s.hole_id === hole.id) || null,
    }));

    if (holesWithShots) {
      const holeMap: Eighteen_Hole_Data = {
        hole_one: holesWithShots[0]!,
        hole_two: holesWithShots[1]!,
        hole_three: holesWithShots[2]!,
        hole_four: holesWithShots[3]!,
        hole_five: holesWithShots[4]!,
        hole_six: holesWithShots[5]!,
        hole_seven: holesWithShots[6]!,
        hole_eight: holesWithShots[7]!,
        hole_nine: holesWithShots[8]!,
        hole_ten: holesWithShots[9]!,
        hole_eleven: holesWithShots[10]!,
        hole_twelve: holesWithShots[11]!,
        hole_thirteen: holesWithShots[12]!,
        hole_fourteen: holesWithShots[13]!,
        hole_fifteen: holesWithShots[14]!,
        hole_sixteen: holesWithShots[15]!,
        hole_seventeen: holesWithShots[16]!,
        hole_eighteen: holesWithShots[17]!,
      };

      return holeMap;
    }
  }
}
