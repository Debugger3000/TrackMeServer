import { Elysia } from "elysia";
import { testRoute } from "./routes/test";
import { authRoute } from "./routes/auth.ts";
import "./database/config.ts";

console.log("Environment: ", process.env.ENVIRONMENT);
const port = 3000;

// Elysia
// passes Context objects which contain (req info)

const app = new Elysia()
  .get("/", () => {
    return {
      message: "Hello User, this is main elysia route...",
    };
  })
  .use(authRoute)
  .use(testRoute)
  .listen(port);

console.log(`Listening on http://localhost:${port} ...`);
// console.log("connected to db ", client);
