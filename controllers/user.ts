import type { Cookie } from "elysia";
import jwt from "jsonwebtoken";
import { verifyTokenHelper } from "../middleware/token";
import type { IToken } from "../types/user";

// Basic grab logged in users info
// Username
export const getUserInfo = (
  cookie: Record<string, Cookie<string | undefined>>
) => {
  try {
    console.log("Inside getUserInfo");
    const access_secret = process.env.JWT_ACCESS_SECRET;

    if (!access_secret) {
      return 500;
    }

    const accessToken = cookie!.accessToken?.value;
    //.log("refresh token in verifyToken(): ", accessToken);

    const accessTokenResult = verifyTokenHelper(accessToken, access_secret);

    if (accessTokenResult === "BAD_TOKEN" || accessTokenResult === undefined) {
      return 500;
    }

    //.log("accessTokenResult: ", accessTokenResult);
    // return data from token
    const result: IToken = {
      id: accessTokenResult.id,
      username: accessTokenResult.username,
    };
    //.log("returning user info: ", result);
    return result;
  } catch (error) {
    console.log("Error in getUserInfo controller: ", error);
  }
};
