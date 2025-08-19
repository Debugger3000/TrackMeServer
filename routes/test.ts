import { Elysia } from "elysia";
import { testGet } from "../controllers/test";

export const testRoute = new Elysia({ prefix: "/test" })
  .get("/", () => {
    console.log("Test get path has been hit");
    return testGet();
  })
  .post("/", ({ body }) => {
    return testGet();
  });
