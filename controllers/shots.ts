import type { TupleType } from "typescript";
import sql from "../database/config";
import type { IShot } from "../types/shots";
import { verifyToken, verifyTokenHelper } from "../middleware/token";
import { Cookie } from "elysia";

export const postShotData = async (shotDataBody: IShot[]) => {
  console.log("INSIDE shots CONTROLLER");

  try {
    const normalizedShots = shotDataBody.map((s) => ({
      userid: s.userId,
      clubtype: s.clubType,
      shotcontact: s.shotContact,
      shotpath: s.shotPath,
    }));

    console.log("ShotData normalized body: ", normalizedShots);

    const result = await sql`
        INSERT INTO shots
        ${sql(normalizedShots)}
        RETURNING id
        `;

    // console.log("result of query hehe", result);

    return { success: true, message: "Shot uploaded successfully !" };
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Server post shot data Error" };
  }
};

// get shot data
export const getShotData = async (
  cookie: Record<string, Cookie<string | undefined>>
) => {
  try {
    console.log("inside getShotData");

    const refresh_secret = process.env.JWT_REFRESH_SECRET;

    // get id from refresh token
    const result = verifyTokenHelper(
      cookie.refreshToken?.value,
      refresh_secret
    );

    if (result === "BAD_TOKEN") {
      console.log("bad refresh token... somehow getShotData");
      return null;
    } else {
      console.log("token user id:", result.id);
      const queryResult = await sql<IShot[]>`
        select * from shots where userid = ${result.id}
        `;
      console.log("query result shotdata: ", queryResult.columns);

      const rowData: IShot[] = [...queryResult];
      if (rowData != null || rowData != undefined) {
        return rowData;
      } else {
        console.log(
          "shot data returning null because query result is null or undefined"
        );

        return null;
      }
    }
  } catch (error) {
    console.log("getShotData error: ", error);
  }
};
