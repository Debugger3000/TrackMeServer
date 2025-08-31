import { Elysia, status } from "elysia";
import { postShotData } from "../controllers/shots";
import type { IShot } from "../types/shots";

export const shotDataRoute = new Elysia({ prefix: "/api/data" })
  .post("/shot", async ({ body }) => {
    try {
      console.log("In adding shot Data");
      const result = await postShotData(body as IShot[]);
      if (result.success) {
        console.log("500 for post shot data");
        throw status(500);
      } else {
        console.log("returning user info");
        return result;
      }
    } catch (error) {
      console.log("Error in get user info router");
    }
  })
  .get("/shot", ({ body }) => {
    try {
      console.log("In adding shot Data");
      //   const result = await postShotData(body as IShot[]);

      return { success: true, message: "route good" };
    } catch (error) {
      console.log("Error in get user info router");
    }
  });
