import sql from "../database/config";
import type { Hole_Submit } from "../types/game";

export const patchGameHole = async (holeBody: Hole_Submit) => {
  console.log("INSIDE patch hole game CONTROLLER");

  try {

    if(!sql){
      return { success: false, message: "patch game hole!" };
    }

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

    console.log("Hole_STATE PATCH... ", holeBody.hole_state);
    // if its last hole for 18 or 9, we need to set game_status to COMPLETE
    // reset hole state so when you view finished game, you start on hole 1...
    if (holeBody.hole_state === 18 || holeBody.hole_state === 9) {
      console.log("Running game completion hole patch...");
      const [updatedGame] = await sql`
      UPDATE games
      SET score = ${holeBody.game_score},
      hole_state = 1,
          status = 'COMPLETE'
      WHERE id = ${holeBody.game_id}
      RETURNING *;
    `;
    } else {
      console.log("Running normal af hole patch...");
      const [updatedGame] = await sql`
      UPDATE games
      SET score = ${holeBody.game_score},
          hole_state = hole_state + 1
      WHERE id = ${holeBody.game_id}
      RETURNING *;
    `;
    }

    // now update game object with new score + hole_state

    // console.log("result of query hehe", result);

    return { success: true, message: "Patched hole !" };
  } catch (error) {
    console.log("PatchHole controller error: ", error);
    return { success: false, message: "Patch hole failed !" };
  }
};

export const patchPreviousGameHole = async (holeBody: Hole_Submit) => {
  console.log("INSIDE patch previous hole game CONTROLLER");

  try {

    if(!sql){
      return { success: false, message: "patch prev game hole !" };
    }

    //.log("patch preivous hole body: ", holeBody);

    // patch hole with score and putt / notes
    const [result] = await sql`
    UPDATE holes
      SET putt_count = ${holeBody.putt_count},
          score = ${holeBody.score},
          notes = ${holeBody.notes}
      WHERE id = ${holeBody.id}
      RETURNING *;
    `;

    // DO NOT increment hole_state... we are editing a previous hole...
    const [updatedGame] = await sql`
      UPDATE games
      SET score = ${holeBody.game_score},
          hole_state = hole_state
      WHERE id = ${holeBody.game_id}
      RETURNING *;
    `;

    // now update game object with new score + hole_state

    // console.log("result of query hehe", result);

    return { success: true, message: "Patched previous hole !" };
  } catch (error) {
    console.log("PatchHole controller error: ", error);
    return { success: false, message: "Patch hole failed !" };
  }
};
