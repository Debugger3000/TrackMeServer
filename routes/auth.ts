import { Elysia } from "elysia";
import { loginUser, registerUser } from "../controllers/auth";
import type { IRegisterBody } from "../types/user";

export const authRoute = new Elysia({ prefix: "/api" })
  .post("/register", ({ body, cookie }) => {
    console.log("Register route path has been hit");
    const { username, password } = body as IRegisterBody;
    return registerUser(username, password, cookie);
  })
  .post("/", ({ body }) => {
    const { username, password } = body as IRegisterBody;
    return loginUser(username, password);
  });
