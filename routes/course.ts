import { Elysia, status } from "elysia";
import { getCourse, postCourseData } from "../controllers/course";
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
  .get("/grab", async ({ body }) => {
    try {
      console.log("In adding course Data");
      const result = await getCourse(body as string);
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
  });
