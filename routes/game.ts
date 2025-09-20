import { Elysia, status } from "elysia";
import {
  createGameData,
  getCurrentGames,
  getEightGameById,
  getNineGameById,
} from "../controllers/game";
import type { ICourseView, THoles } from "../types/course";
import { patchGameHole } from "../controllers/hole";
import type { Hole_Submit } from "../types/game";

export const gameDataRoute = new Elysia({ prefix: "/api/game" })
  .post("/create", async ({ body, cookie }) => {
    try {
      console.log("In adding course Data");
      const result = await createGameData(body as ICourseView, cookie);
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
  .get("/data/:game_id", async ({ params, query }) => {
    try {
      console.log("In GET GAME DATA");
      const holes = Number(query.holes) as THoles;
      console.log("holes: ", holes);

      if (!holes) {
        throw status(500);
      }

      // go nine
      if (holes === 9) {
        const result = await getNineGameById(params);
        if (!result) {
          console.log("500 for get game by id");
          throw status(500);
        } else {
          console.log("Game by id found. Returning to client.");
          return result;
        }
      }
      // go eight
      else {
        const result = await getEightGameById(params);
        if (!result) {
          console.log("500 for get game by id");
          throw status(500);
        } else {
          console.log("Game by id found. Returning to client.");
          return result;
        }
      }
    } catch (error) {
      console.log("Error in get game data router");
    }
  })
  .get("/in-progress", async ({ cookie }) => {
    try {
      console.log("Getting in progress games in router");
      const result = await getCurrentGames(cookie);
      if (!result) {
        console.log("500 for get in-progress games");
        throw status(500);
      } else {
        console.log(
          "games by in-progress has been found. Returning to client."
        );
        return result;
      }
    } catch (error) {
      console.log("Error in get inprogress games data router");
    }
  })
  .patch("/hole", async ({ body }) => {
    try {
      console.log("Patching a hole...");
      const result = await patchGameHole(body as Hole_Submit);
      if (!result) {
        console.log("500 for patch a game hole");
        throw status(500);
      } else {
        console.log("Patched a hole... Returning to client.");
        return result;
      }
    } catch (error) {
      console.log("Error in patch hole in games data router");
    }
  });
