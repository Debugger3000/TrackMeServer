import sql from "../database/config";
import type { IShot } from "../types/shots";

export const postShotData = async (shotDataBody: IShot[]) => {
  console.log("INSIDE shots CONTROLLER");

  try {
    const shotData: IShot[] = shotDataBody;
    let rows: string[] = [];

    // Using sql.join to safely insert multiple rows
    // const rows = shotData.map(
    //   (s) => sql`(${s.userId}, ${s.clubType}, ${s.shotContact}, ${s.shotPath})`
    // );

    for (const s of shotData) {
      rows.push(
        `(${s.userId}, '${s.clubType}', '${s.shotContact}', '${s.shotPath}')`
      );
    }

    const result = await sql`
        INSERT INTO shots (user_id, club_type, shot_contact, shot_path)
        VALUES ${rows.join(", ")}
        RETURNING id
        `;

    console.log("result of query hehe", result);

    return { success: true, message: "Sign in successful" };
  } catch (error) {
    console.log("Login user error: ", error);
    return { success: false, message: "Server Error" };
  }
};
