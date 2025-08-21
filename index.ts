import { Cookie, Elysia, status } from "elysia";
import { cors } from "@elysiajs/cors";
import { testRoute } from "./routes/test";
import { authRoute } from "./routes/auth.ts";
import { verifyToken } from "./middleware/token.ts";
import "./database/config.ts";

console.log("Environment: ", process.env.ENVIRONMENT);
const port = 3000;

// Elysia
// passes Context objects which contain (req info)

const app = new Elysia()
  .use(
    cors({
      origin: process.env.ORIGIN,
      credentials: true,
    })
  )
  .onError(({ code, error }) => {
    console.log("Error was thrown from somewhere: ", code);
    console.log("Error thrown in onError: ", error);
    if (error instanceof Error && error.message === "VALIDATION") {
      console.log("Error message: ", error.message);
      return new Response(JSON.stringify({ Error: "BAD_TOKEN" }));
    } else {
      return new Response(error.toString());
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
          path.includes("/onLoadTokenCheck")
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

  .get("/", () => {})
  .use(authRoute)
  .use(testRoute)
  .listen(port);

console.log(`Listening on http://localhost:${port} ...`);
// console.log("connected to db ", client);

// .mapResponse(({ response, set, headers }) => {
//     console.log("Map response ran");
//     // const accessToken = headers["x-access-token"];
//     // console.log("Map response access token on headers: ", accessToken);
//     console.log("response object: ", response);
// if exists, then append onto response
// if (accessToken) {
//   console.log("access token exists in map response");
//   if (response instanceof Response) {
//     console.log("Setting response header with access token");
//     response.headers.set("x-access-token", accessToken);
//   }
// }
// })
