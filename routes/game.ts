import { Elysia, status } from "elysia";
import {
  createGameData,
  deleteGameById,
  getCompleteGames,
  getCurrentGames,
  getEightGameById,
  getNineGameById,
} from "../controllers/game";
import type { ICourseView, THoles } from "../types/course";
import { patchGameHole, patchPreviousGameHole } from "../controllers/hole";
import type { Hole_Submit } from "../types/game";
import { getGamesBySearch, getGameStats, getSoloGameStats } from "../controllers/game-stats";

export const gameDataRoute = new Elysia({ prefix: "/api/game" })
.delete("/:game_id", async ({ params }) => {
    try {
      console.log("In adding course Data");
      const result = await deleteGameById(params);
      if (!result || !result.success) {
        console.log("500 for delete game");
        throw status(500);
      } else {
        console.log("delete game good. Returning success.");
        return result;
      }
    } catch (error) {
      console.log("Error in delete game router");
    }
  })
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
  .get("/stats/:timeFilter", async ({ params, cookie, query }) => {
    try {
      console.log("In GAMES STATISTICS");

      const holes = Number(query.holes) as THoles;
      console.log("holes GET GAME STats: ", holes);

      if (!holes) {
        throw status(500);
      }


      const result = await getGameStats(params, cookie, holes);
      if (!result) {
        console.log("500 for get game stats");
        throw status(500);
      } else {
        console.log("Games stats found. Returning to client.");
        return result;
      }
    } catch (error) {
      console.log("Error in get game stats");
    }
  })
  .get("/stats/solo/:game_id", async ({ params, cookie }) => {
    try {
      console.log("In GAMES STATISTICS");
      const result = await getSoloGameStats(params, cookie);
      if (!result) {
        console.log("500 for get solo game stats");
        throw status(500);
      } else {
        console.log("Games  solo  stats found. Returning to client.");
        return result;
      }
    } catch (error) {
      console.log("Error in get solo game stats");
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
  .get("/grab/:club_name", async ({ params, cookie }) => {
    try {
      console.log("In getting game by search");
      const result = await getGamesBySearch(params, cookie);
      if (!result) {
        console.log("500 for get game by name");
        throw status(500);
      } else {
        console.log("game by search has found. Returning to client.");
        return result;
      }
    } catch (error) {
      console.log("Error in get game by search router");
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
  .get("/completed", async ({ cookie, query }) => {
    try {
      console.log("Getting completed games in router");

      // grab query value here
      const limit = Number(query.limit);
      console.log("get completed, query limit: ", limit);

      if(!limit){
        console.log("Query for limit, for GET completed games was undefined...");
        throw status(500);
      }

      const result = await getCompleteGames(cookie);
      if (!result) {
        console.log("500 for get completed games");
        throw status(500);
      } else {
        console.log("games by completed has been found. Returning to client.");
        return result;
      }
    } catch (error) {
      console.log("Error in get completed games data router");
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
  })
  .patch("/hole/previous-edit", async ({ body }) => {
    try {
      console.log("Patching a previous hole...");
      const result = await patchPreviousGameHole(body as Hole_Submit);
      if (!result) {
        console.log("500 for patch previous a game hole");
        throw status(500);
      } else {
        console.log("Patched a previous hole... Returning to client.");
        return result;
      }
    } catch (error) {
      console.log("Error in patch previous hole in games data router");
    }
  });
