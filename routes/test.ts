import { Elysia } from "elysia";
import { testGet } from "../controllers/test";

export const testRoute = new Elysia({ prefix: "/api/test" })
  .get("/", () => {
    console.log("Test get path has been hit");
    return testGet();
  })
  .post("/", ({ body }) => {
    return testGet();
  });
