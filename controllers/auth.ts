import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import sql from "../database/config";

// login a user
export const loginUser = async (email: string, password: string) => {
  // find user in database
  // const user = users.find(u => u.email === email);
  // if (!user) throw new Error("User not found");

  // const valid = await bcrypt.compare(password, user.passwordHash);
  // if (!valid) throw new Error("Invalid password");

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not defined");

  const token = jwt.sign({ email }, secret, {
    expiresIn: "1h",
  });
  return { token };

  return "tehe";
};

// register a new user
export const registerUser = async (username: string, password: string) => {
  console.log("Register user controller hit");

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not defined");

    const passwordHash = await bcrypt.hash(password, 10);

    const [user] = await sql`
    INSERT INTO users (username, password_hash)
    VALUES (${username}, ${passwordHash})
    RETURNING id, username
  `;

    console.log("Returned data from post query: ", user);

    const token = jwt.sign({ username }, secret, { expiresIn: "1h" });
    return { token };
  } catch (error) {
    console.log("Register User Error: ", error);
  }
};

export const checkUser = () => {};
