import type { TupleType } from "typescript";
import sql from "../database/config";
import {
  SHOTPATH_ITER,
  SHOTPATH_POP,
  type IShot,
  type IShotFromSql,
} from "../types/shots";
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

// get shot data for shot paths via club type...
export const getShotData = async (
  cookie: Record<string, Cookie<string | undefined>>,
  params: { clubType: string }
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
      console.log("club type queried for: ", params.clubType);
      const queryResult = await sql<IShotFromSql[]>`
        select clubtype, shotcontact, shotpath, created_at from shots where userid = ${result.id} and clubtype = ${params.clubType}
        `;
      console.log("query result shotdata: ", queryResult.columns);

      const rowData: IShotFromSql[] = [...queryResult];
      console.log("row data nromalzied: ", rowData);
      if (rowData != null || rowData != undefined) {
        // filter number of shotpaths via the clubtype out into number[]
        // [number,number,number,number,number,number,number,number,number]

        let dataObject = {
          clubType: params.clubType,
          dataSet: [0],
        };

        let zeroArray = [...SHOTPATH_POP];

        console.log("iter array: ", SHOTPATH_ITER);

        console.log("zero array before: ", zeroArray);

        for (let i = 0; i < rowData.length; i++) {
          const index = SHOTPATH_ITER.indexOf(rowData[i]!.shotpath);

          console.log("shotpath: ", rowData[i]!.shotpath);
          console.log("index grabbed: ", index);
          zeroArray[index] = zeroArray[index]! + 1;
        }
        dataObject.dataSet = zeroArray;
        console.log("zero array after: ", zeroArray);
        console.log("dataObject: ", dataObject);

        return dataObject;
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
