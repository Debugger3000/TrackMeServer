import { Elysia, status } from "elysia";
import { getUserInfo } from "../controllers/user";

export const userRoute = new Elysia({ prefix: "/api/user" }).get(
  "/userinfo",
  ({ cookie }) => {
    try {
      console.log("In getuser info router");
      const result = getUserInfo(cookie);
      if (result === 500 || undefined) {
        console.log("500 for getUserInfo");
        throw status(500);
      } else {
        console.log("returning user info");
        return result;
      }
    } catch (error) {
      console.log("Error in get user info router");
    }
  }
);
