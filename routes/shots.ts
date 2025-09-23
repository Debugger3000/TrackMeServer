import { Elysia, status } from "elysia";
import {
  deleteGameShotData,
  getShotData,
  postGameShotData,
  postShotData,
} from "../controllers/shots";
import type { IShot } from "../types/shots";
import type { Game_Shot_Data_Submit, Game_Shot_Delete } from "../types/game";

export const shotDataRoute = new Elysia({ prefix: "/api/data" })
  .post("/shot", async ({ body }) => {
    try {
      console.log("In adding shot Data");
      const result = await postShotData(body as IShot[]);
      if (!result.success) {
        console.log("500 for post shot data");
        throw status(500);
      } else {
        console.log("Shot Data has been posted. Returning success.");
        return result;
      }
    } catch (error) {
      console.log("Error in post shot data router");
    }
  })
  .get("/shot/:clubType", async ({ cookie, params }) => {
    try {
      console.log("Getting stats data...");
      const result = await getShotData(cookie, params);
      if (!result) {
        console.log("500 for post shot data");
        throw status(500);
      } else {
        console.log("Returning shot data to client...");
        return result;
      }
    } catch (error) {
      console.log("Error in get user info router");
    }
  })
  .post("/game-shot", async ({ body }) => {
    try {
      console.log("In adding GAME shot Data");
      const result = await postGameShotData(body as Game_Shot_Data_Submit);
      if (!result.success) {
        console.log("500 for post GAME shot data");
        throw status(500);
      } else {
        console.log("GAME Shot Data has been posted. Returning success.");
        return result;
      }
    } catch (error) {
      console.log("Error in post GAME shot data router");
    }
  })
  .delete("/game-shot", async ({ body }) => {
    try {
      console.log("In adding GAME shot Data");
      const result = await deleteGameShotData(body as Game_Shot_Delete);
      if (!result.success) {
        console.log("500 for post GAME shot data");
        throw status(500);
      } else {
        console.log("GAME Shot Data has been posted. Returning success.");
        return result;
      }
    } catch (error) {
      console.log("Error in post GAME shot data router");
    }
  });
