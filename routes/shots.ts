import { Elysia, status } from "elysia";
import {
  deleteGameShotData,
  getShotData,
  postGameShotData,
  postShotData,
} from "../controllers/shots";
import type { IShot, IShotType } from "../types/shots";
import type { Game_Shot_Data_Submit, Game_Shot_Delete } from "../types/game";
import { getManyGameShots, getSoloGameShotStats } from "../controllers/game-stats";

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
  })
  .get("/stats/game-many/:timeFilter", async ({ params, cookie, query }) => {
      try {

        const club_type = query.club_type as IShotType;
        if(!club_type){
          throw status(500);
        }   

        console.log("In GAMES STATISTICS");
        const result = await getManyGameShots(params, cookie, club_type);
        if (!result) {
          console.log("500 for get game many shots stats");
          throw status(500);
        } else {
          console.log("Games many shots stats found. Returning to client.");
          return result;
        }
      } catch (error) {
        console.log("Error in get many game shots stats");
      }
    })
    .get("/stats/game-solo/:game_id", async ({ params, cookie, query }) => {
      try {

        const club_type = query.club_type as IShotType;
        if(!club_type){
          throw status(500);
        }   

        console.log("In GAMES STATISTICS");
        const result = await getSoloGameShotStats(params, cookie, club_type);
        if (!result) {
          console.log("500 for get game many shots stats");
          throw status(500);
        } else {
          console.log("Games many shots stats found. Returning to client.");
          return result;
        }
      } catch (error) {
        console.log("Error in get many game shots stats");
      }
    });
