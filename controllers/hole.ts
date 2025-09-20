import sql from "../database/config";
import type { Hole_Submit } from "../types/game";

export const patchGameHole = async (holeBody: Hole_Submit) => {
  console.log("INSIDE patch hole game CONTROLLER");

  try {
    console.log("patch hole body: ", holeBody);

    // patch hole with score and putt / notes
    const [result] = await sql`
    UPDATE holes
      SET putt_count = ${holeBody.putt_count},
          score = ${holeBody.score},
          notes = ${holeBody.notes}
      WHERE id = ${holeBody.id}
      RETURNING *;
    `;

    const [updatedGame] = await sql`
      UPDATE games
      SET score = ${holeBody.game_score},
          hole_state = hole_state + 1
      WHERE id = ${holeBody.game_id}
      RETURNING *;
    `;

    // now update game object with new score + hole_state

    // console.log("result of query hehe", result);

    return { success: true, message: "Patched hole !" };
  } catch (error) {
    console.log("PatchHole controller error: ", error);
    return { success: false, message: "Patch hole failed !" };
  }
};
