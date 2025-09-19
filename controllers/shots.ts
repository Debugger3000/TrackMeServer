import sql from "../database/config";
import {
  CONTACT_ITER,
  CONTACT_POP,
  SHOTPATH_ITER,
  SHOTPATH_POP,
  type IShot,
  type IShotFromSql,
} from "../types/shots";
import { verifyToken, verifyTokenHelper } from "../middleware/token";
import { Cookie } from "elysia";
import type { Game_Shot_Data_Submit } from "../types/game";

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
          ishot: {
            clubType: params.clubType,
            dataSet: [0],
          },
          icontact: {
            total: 0,
            dataSet: [0],
          },
        };

        const dataLength = rowData.length;

        let zeroArray = [...SHOTPATH_POP];
        let zeroArrayContact = [...CONTACT_POP];

        console.log("iter array: ", SHOTPATH_ITER);

        console.log("zero array before: ", zeroArray);

        for (let i = 0; i < dataLength; i++) {
          const index = SHOTPATH_ITER.indexOf(rowData[i]!.shotpath);

          console.log("shotpath: ", rowData[i]!.shotpath);
          console.log("index grabbed: ", index);
          zeroArray[index] = zeroArray[index]! + 1;

          // get index for contact array
          const contactIndex = CONTACT_ITER.indexOf(rowData[i]!.shotcontact);
          zeroArrayContact[contactIndex] = zeroArrayContact[contactIndex]! + 1;
        }
        // set shot array
        dataObject.ishot.dataSet = zeroArray;

        // set contact array
        dataObject.icontact.dataSet = zeroArrayContact;

        // set contact total
        dataObject.icontact.total = dataLength;
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

// GAME SHOT POST
// -----------------
//
export const postGameShotData = async (body: Game_Shot_Data_Submit) => {
  console.log("INSIDE GAME shots CONTROLLER");

  try {
    console.log("ShotData GAMER : ", body);

    const objecter = {
      hole_id: Number(body.hole_id),
      user_id: Number(body.user_id),
      game_id: Number(body.game_id),
      shot_count: Number(body.shot_count),
      club_type: body.club_type ?? undefined,
      shot_contact: body.shot_contact,
      shot_path: body.shot_path,
      start_lat: body.start_lat ?? null,
      start_lng: body.start_lng ?? null,
      end_lat: body.end_lat ?? null,
      end_lng: body.end_lng ?? null,
      land_type: body.land_type ?? null,
      yards: body.yards ?? null,
      metres: body.metres ?? null,
      stroke: body.stroke,
    };

    const result = await sql`
  INSERT INTO game_shots 
  ${sql([objecter])}
  RETURNING id
`;

    console.log("result of query hehe", result);

    return { success: true, message: "GAME Shot uploaded successfully !" };
  } catch (error) {
    console.log("PostGAMEShotData controller error: ", error);
    return { success: false, message: "Server post GAME shot data Error" };
  }
};
