import { Elysia, status } from "elysia";
import {
  loginUser,
  registerUser,
  checkRefreshToken,
  logout,
} from "../controllers/auth";
import type { IRegisterBody } from "../types/user";

export const authRoute = new Elysia({ prefix: "/api/auth" })
  .post("/logout", ({ cookie }) => {
    const result = logout(cookie);
    if (result) {
      return { success: true, message: "Logout Successful" };
    } else {
      return { success: false, message: "Logout Failed" };
    }
  })
  .post("/onLoadTokenCheck", ({ cookie }) => {
    const result = checkRefreshToken(cookie);
    if (result === "BAD_JWT_SECRETs") {
      throw status(500);
    } else {
      return result;
    }
  })
  .post("/register", async ({ body, cookie }) => {
    console.log("Register route path has been hit");
    const { username, password } = body as IRegisterBody;
    const result = await registerUser(username, password, cookie);
    if (!result.success) {
      return result;
    } else {
      throw status(500);
    }
  })
  .post("/login", async ({ body, cookie }) => {
    console.log("AT LOGIN ROUTER");
    const { username, password } = body as IRegisterBody;
    const result = await loginUser(username, password, cookie);
    if (result.success) {
      return result;
    } else {
      console.log("bad success: ", result.message);
      throw status(500);
    }
  });
