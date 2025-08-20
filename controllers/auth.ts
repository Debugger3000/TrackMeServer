import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import sql from "../database/config";
import type { Cookie, HTTPHeaders, StatusMap } from "elysia";
import type { ElysiaCookie } from "elysia/cookies";

// Two token approach

// Access token (short lived in client memory)

// Refresh token (long lived through cookies)

// login a user
export const loginUser = async (username: string, password: string) => {
  // find user in database
  // const user = users.find(u => u.email === email);
  // if (!user) throw new Error("User not found");

  const [user] = await sql`
    select * from users 
    where username = ${username}
  `;

  if (!user) {
    return null;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined");

  const token = jwt.sign({ username }, secret, {
    expiresIn: "1h",
  });
  return { token };
};

// register a new user
export const registerUser = async (
  username: string,
  password: string,
  cookie: Record<string, Cookie<string | undefined>>
) => {
  console.log("Register user controller hit");

  try {
    const access_secret = process.env.JWT_ACCESS_SECRET;
    const refresh_secret = process.env.JWT_REFRESH_SECRET;
    if (!access_secret || !refresh_secret)
      throw new Error("JWT_SECRET not defined");

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username
  `;

    if (!user) {
      return null;
    }

    console.log("Returned data from post query: ", user);

    // create refresh token and add to cookie for response
    const refreshToken = jwt.sign({ username }, refresh_secret, {
      expiresIn: "3d",
    });

    // set cookie
    cookie?.refreshToken!.set({
      value: refreshToken,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 3, // 3 days
    });

    // console.log("Cookies been SET to: ", cookie?.value);

    const accessToken = jwt.sign({ username }, access_secret, {
      expiresIn: "1h",
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "x-access-token": accessToken,
      },
    });
  } catch (error) {
    console.log("Register User Error: ", error);
  }
};

// middleware to auth between protected routes
// token needs to be valid in order for user to access resources
export const checkUserToken = () => {};
