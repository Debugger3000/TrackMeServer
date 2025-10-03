import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import sql from "../database/config";
import type { Cookie, HTTPHeaders, StatusMap } from "elysia";
import type { ElysiaCookie } from "elysia/cookies";
import { createToken, verifyTokenHelper } from "../middleware/token";
import type { IToken, User } from "../types/user";
import { COOKIELIFE } from "../types/auth";

// Two token approach

// Access token (short lived in client memory)

// Refresh token (long lived through cookies)

// login a user
// if someone logging in, they got no refresh or access token
export const loginUser = async (
  username: string,
  password: string,
  cookie: Record<string, Cookie<string | undefined>>
) => {
  console.log("INSIDE LOGIN CONTROLLER");

  try {
    const access_secret = process.env.JWT_ACCESS_SECRET;
    const refresh_secret = process.env.JWT_REFRESH_SECRET;
    if (!access_secret || !refresh_secret) {
      return { success: false, message: "Server secret error" };
    }

    // console.log("Pool stats:", sql.options);

    const [user] = await sql`
    select * from users 
    where username = ${username}
  `;

  console.log("After login GET user data...");

    if (!user) {
      return { success: false, message: "Database finding user Error" };
    }

    const id = user.id;

    console.log("user id: ", id);
    console.log("username: ", username);

    console.log("user found: ", user);
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return { success: false, message: "Password did not match username" };
    }

    const accessToken = createToken<IToken>(
      { id, username },
      access_secret,
      COOKIELIFE.accessTokenLife
    );

    if (accessToken === "BAD_A_TOKEN") {
      return { success: false, message: "Create access token failed in login" };
    }
    // const accessToken = jwt.sign({ username }, access_secret, {
    //   expiresIn: "1h",
    // });
    // set cookie
    cookie?.accessToken!.set({
      value: accessToken,
      httpOnly: true,
      maxAge: COOKIELIFE.accessTokenLife,
    });

    const refreshToken = createToken<IToken>(
      { id, username },
      refresh_secret,
      COOKIELIFE.refreshTokenLife
    );

    if (refreshToken === "BAD_A_TOKEN") {
      return {
        success: false,
        message: "Create refresh token failed in login",
      };
    }

    // const refreshToken = jwt.sign({ username }, refresh_secret, {
    //   expiresIn: "3d",
    // });
    // set cookie
    cookie?.refreshToken!.set({
      value: refreshToken,
      httpOnly: true,
      maxAge: COOKIELIFE.refreshTokenLife,
    });
    console.log("returning login success");
    return { success: true, message: "Sign in successful" };
  } catch (error) {
    console.log("Login user error: ", error);
    return { success: false, message: "Server Error" };
  }
};

// register a new user
export const registerUser = async (
  username: string,
  password: string,
  cookie: Record<string, Cookie<string | undefined>>
) => {
  console.log("Register user controller hit");

  try {
    // check DB for username uniqueness
    //   const [checkUser] = await sql`
    //   select * from users
    //   where username = ${username}
    // `;

    // if(!checkUser){
    //   return
    // }

    const access_secret = process.env.JWT_ACCESS_SECRET;
    const refresh_secret = process.env.JWT_REFRESH_SECRET;
    if (!access_secret || !refresh_secret) {
      return { success: false, message: "Server error" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username
  `;

    if (!user) {
      return { success: false, message: "Database error" };
    }

    const id = user.id;

    console.log("Returned data from post query: ", user);

    // create refresh token and add to cookie for response
    // const refreshToken = jwt.sign({ username }, refresh_secret, {
    //   expiresIn: "3d",
    // });

    const refreshToken = createToken<IToken>(
      { id, username },
      refresh_secret,
      COOKIELIFE.refreshTokenLife
    );

    if (refreshToken === "BAD_A_TOKEN") {
      return {
        success: false,
        message: "Create refresh token failed in register",
      };
    }

    // set cookie
    cookie?.refreshToken!.set({
      value: refreshToken,
      httpOnly: true,
      maxAge: COOKIELIFE.refreshTokenLife,
    });

    // ---------------

    const accessToken = createToken<IToken>(
      { id, username },
      access_secret,
      COOKIELIFE.accessTokenLife
    );

    if (accessToken === "BAD_A_TOKEN") {
      return {
        success: false,
        message: "Create access token failed in register",
      };
    }

    // set cookie
    cookie?.accessToken!.set({
      value: accessToken,
      httpOnly: true,
      maxAge: COOKIELIFE.accessTokenLife,
    });

    return { success: true, message: "hehe" };
  } catch (error) {
    console.log("Register User Error: ", error);
    return { success: false, message: "Server Error" };
  }
};

// Check if refresh token is good on page first load into LOGIN
// Any time, login route on client is hit, this should run first, to auto log in user
// if good, we should send back an access token, so user can get logged in
// if bad, we should just send back no token, so user can log in
export const checkRefreshToken = (
  cookie: Record<string, Cookie<string | undefined>>
) => {
  try {
    const refresh_secret = process.env.JWT_REFRESH_SECRET;
    const result = verifyTokenHelper(
      cookie.refreshToken?.value,
      refresh_secret
    );

    console.log("result of token verify: ", result);

    // bad refresh token, we send back no token at all, just a normal response with falsely success
    if (result === "BAD_TOKEN") {
      console.log("bad refresh in on load token check.");
      return { success: false, message: "Refresh is BAD" };
    } else {
      // create new access token, and pass it back
      const access_secret = process.env.JWT_ACCESS_SECRET;
      if (!access_secret) {
        return "BAD_JWT_SECRETs";
      }
      const id = result.id;
      const username = result.username;
      // const accessToken = jwt.sign({ username }, access_secret, {
      //   expiresIn: "1h",
      // });
      const accessToken = createToken<IToken>(
        { id, username },
        access_secret,
        COOKIELIFE.accessTokenLife
      );

      if (accessToken === "BAD_A_TOKEN") {
        console.log("failed to create access token on load token check.");

        return {
          success: false,
          message: "Create access token failed in checkRefreshToken",
        };
      }

      // set cookie
      cookie?.accessToken!.set({
        value: accessToken,
        httpOnly: true,
        maxAge: COOKIELIFE.accessTokenLife,
      });
      console.log("Access made and set. Returning success on load token check");

      return { success: true, message: "hehe" };
    }
  } catch (error) {
    console.log("error in checkRefreshToken ", error);
  }
};

export const logout = (cookie: Record<string, Cookie<string | undefined>>) => {
  try {
    // set both cookies to maxAge of 0
    // REMOVE access cookie
    cookie?.accessToken!.set({
      value: "",
      httpOnly: true,
      maxAge: 0,
    });

    // REMOVE refresh cookie
    cookie?.refreshToken!.set({
      value: "",
      httpOnly: true,
      maxAge: 0,
    });

    return true;
  } catch (error) {
    console.log("error in logout: ", error);
    return false;
  }
};
