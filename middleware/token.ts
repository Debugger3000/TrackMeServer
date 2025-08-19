import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const verifyToken = (token: string) => {
  try {
    if (!secret) {
      console.log("JWT secret is null. Function VerifyToken()");
      return null;
    }
    // returns the decoded payload if token is valid
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (err) {
    // token invalid or expired
    return null;
  }
};
