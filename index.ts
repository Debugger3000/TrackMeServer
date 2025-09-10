import { Elysia, status } from "elysia";
import { cors } from "@elysiajs/cors";
import { authRoute } from "./routes/auth";
import { userRoute } from "./routes/user";
import { verifyToken } from "./middleware/token";
import "./database/config";
import { shotDataRoute } from "./routes/shots";
import { courseDataRoute } from "./routes/course";

console.log("Environment: ", process.env.ENVIRONMENT);
const port = Number(process.env.PORT || 3000);
const origin =
  process.env.ENVIRONMENT === "prod"
    ? `${process.env.ORIGIN}`
    : `http://localhost:${port}`;

// Elysia
// passes Context objects which contain (req info)

const app = new Elysia()
  .use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  )
  .get("/", () => ({ status: "ok" }))
  .onError(({ code, error }) => {
    console.log("Error was thrown from somewhere: ", code);
    console.log("Error thrown in onError: ", error);
    if (code === 401) {
      console.log("Returning a 401");

      return status(401, "Unauthorized");
    } else {
      return {
        status: 500,
        body: { error: "Server Error" },
      };
    }
  })
  .guard({
    beforeHandle({ cookie, headers, path, set }) {
      // if paths include login or register then we dont need to check any tokens
      // but, if /checkStartSession is run, then we can simply
      console.log("path on before Handle: ", path);
      if (
        !(
          path.includes("/login") ||
          path.includes("/register") ||
          path.includes("/onLoadTokenCheck") ||
          path.includes("/logout")
        )
      ) {
        const result = verifyToken(cookie, headers);
        console.log("result of verifyToken() ", result);
        if (result === "BAD_TOKEN") {
          throw status(401);
        } else if (result === null) {
          throw status(500);
        } else if (result !== true && result !== null) {
          // we have a access token to use
          // set context header, here so we can later set response header
          console.log("Before handle setting access token");
          cookie?.accessToken!.set({
            value: result,
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 1, // 1 day
          });
          // set.headers = { "x-access-token": result };
        }
      }
    },
  })

  .use(authRoute)
  .use(userRoute)
  .use(shotDataRoute)
  .use(courseDataRoute);

export default app;

// const server = Bun.serve({
//   ...app,
//   port,
// });

console.log(`Server running at ${process.env.ORIGIN}:${port}`);

// export default async function handler(req, res) {
//   const app = new Elysia()
//     .get("/health", async () => {
//       const [res] = await sql`SELECT NOW()`;
//       return { dbTime: res };
//     });

//   return app.handle(req, res);
// }
