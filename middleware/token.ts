import jwt from "jsonwebtoken";
import type { Cookie } from "elysia";
import type { IToken } from "../types/user";

const refresh_secret = process.env.JWT_REFRESH_SECRET;
const access_secret = process.env.JWT_ACCESS_SECRET;

export const verifyToken = (
  cookie: Record<string, Cookie<string | undefined>>,
  header: Record<string, string | undefined>
) => {
  console.log("verify token has run !");
  try {
    //return "101";
    if (!refresh_secret || !access_secret) {
      console.log("JWT secret is null. Function VerifyToken()");
      return null;
    }

    // verify refresh token here.

    const refreshToken = cookie!.refreshToken?.value;
    console.log("refresh token in verifyToken(): ", refreshToken);
    // returns the decoded payload for refresh token
    // if bad payload, then this throws error and status 500 sent back to client
    const refreshTokenResult = verifyTokenHelper(refreshToken, refresh_secret);
    if (
      refreshTokenResult === "BAD_TOKEN" ||
      refreshTokenResult === undefined
    ) {
      return "BAD_TOKEN";
    }

    console.log("Refresh token is Good ", refreshTokenResult);

    // check access token
    const accessToken = cookie!.accessToken?.value;
    // console.log("Access token on res header: ", accessToken);

    // No access token, make new one and send off for response
    if (!accessToken) {
      const id = refreshTokenResult.id;
      const username = refreshTokenResult.username;
      const newAccessToken = createToken<IToken>(
        { id, username },
        access_secret,
        3600
      );

      if (newAccessToken === "BAD_A_TOKEN") {
        console.log("No access token, Creation of new access token failed.");
        return null;
      }
      console.log("Returning access token: ", newAccessToken);
      return newAccessToken;
    }
    // BAD access token, make new one.
    else {
      const accessTokenResult = verifyTokenHelper(accessToken, access_secret);
      if (accessTokenResult === "BAD_TOKEN") {
        const id = refreshTokenResult.id;
        const username = refreshTokenResult.username;
        const newAccessToken = createToken<IToken>(
          { id, username },
          access_secret,
          3600
        );
        if (newAccessToken === "BAD_A_TOKEN") {
          console.log("Bad access token, Creation of new access token failed.");
          return null;
        }
        // console.log("Returning access token: ", newAccessToken);
        console.log("Created new access token, off bad access token. Success.");
        return newAccessToken;
      }
    }

    // Access token and Refresh token are Up to date
    // we just allow request to go straight to Request handle

    // Acess token BAD and Rresfresh token GOOD
    // Create new access token, and pass along for After handler set to header

    // Refresh Token is BAD
    // we return null, and we need return response error so client gets logged out and redirect to login...
    console.log("verify Token returning true");
    return true;
  } catch (err) {
    // token invalid or expired
    console.log("VerifyToken() function Error: ", err);
    return null;
  }
};

export function verifyTokenHelper(
  token: string | undefined,
  secret: string | undefined
) {
  try {
    if (token && secret) {
      console.log("verify token paramter: ", token);
      console.log("secret param: ", secret);
      const payload = jwt.verify(token, secret) as jwt.JwtPayload;
      return payload;
    } else {
      console.log("else hit in verifiyTokenHelper");
      return "BAD_TOKEN";
    }
  } catch (error) {
    return "BAD_TOKEN";
  }
}

export function createToken<T extends object>(
  payload: T,
  secret: string,
  expiry: number
) {
  try {
    const token = jwt.sign(payload, secret, {
      expiresIn: expiry,
    });
    return token;
  } catch (error) {
    return "BAD_A_TOKEN";
  }
}
