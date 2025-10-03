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
      throw status(500);
    }
  })
  .post("/onLoadTokenCheck", ({ cookie }) => {
    const result = checkRefreshToken(cookie);
    if (result === "BAD_JWT_SECRETs") {
      console.log("BAD secrets for onLoad token check");
      throw status(500);
    } else if (!result?.success) {
      console.log("BAD Refresh token it seems... for onLoad check");
      throw status(401);
    } else {
      console.log("GOOD on load token check...");
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
      console.log("bad success: ", result.message);
      throw status(500);
    }
  })
  .post("/login", async ({ body, cookie }) => {
    console.log("AT LOGIN ROUTER");
    const { username, password } = body as IRegisterBody;
    const result = await loginUser(username, password, cookie);
    if (result.success) {
      console.log("successful login. Returning tokens to client");
      return result;
    } else {
      console.log("bad success: ", result.message);
      throw status(500);
    }
  });
