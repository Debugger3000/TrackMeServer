import { Elysia, status } from "elysia";
import { getCourseByClub, postCourseData } from "../controllers/course";
import type { ICourse } from "../types/course";

export const courseDataRoute = new Elysia({ prefix: "/api/course" })
  .post("/add", async ({ body }) => {
    try {
      console.log("In adding course Data");
      const result = await postCourseData(body as ICourse);
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
  });
