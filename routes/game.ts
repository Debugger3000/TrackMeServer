import { Elysia, status } from "elysia";
import { getCourseByClub, postCourseData } from "../controllers/course";
import { createGameData, getCurrentGames } from "../controllers/game";
import type { ICourseView } from "../types/course";

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
  .get("/grab/:club_name", async ({ params }) => {
    try {
      console.log("In adding course Data");
      const result = await getCourseByClub(params);
      if (!result) {
        console.log("500 for get course by club_name");
        throw status(500);
      } else {
        console.log("course by club_name has been found. Returning to client.");
        return result;
      }
    } catch (error) {
      console.log("Error in post shot data router");
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
  });
