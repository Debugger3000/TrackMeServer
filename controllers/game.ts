import type {
  eighteen_hole_card,
  ICourse,
  ICourseView,
  THoles,
} from "../types/course";
import sql from "../database/config";
import type { Cookie } from "elysia";
import { verifyTokenHelper } from "../middleware/token";
import { GAME_STATUS, type IGame, type IGameView } from "../types/game";

export const createGameData = async (
  body: ICourseView,
  cookie: Record<string, Cookie<string | undefined>>
) => {
  console.log("INSIDE create Game object CONTROLLER");

  try {
    const access_secret = process.env.JWT_ACCESS_SECRET;

    const accessTokenResult = verifyTokenHelper(
      cookie.accessToken?.value,
      access_secret
    );
    if (accessTokenResult === "BAD_TOKEN" || accessTokenResult === undefined) {
      return {
        success: false,
        message: "Access token error in createGameData",
        id: "",
      };
    }
    const user_id = accessTokenResult.id;

    console.log("create game, course_id param: ", body);

    const holes: THoles = body.holes;
    let hole_table = holes === 18 ? "eighteen_score_cards" : "nine_score_cards";

    // grab course data.
    // cant grab scorecard cause we dont know whe
    const result_course_scorecard = await sql`
      insert into games (user_id, course_id, status, score, par, holes, hole_state)
      VALUES (${user_id},${body.id}, 'IN-PROGRESS', 0, ${body.par}, ${body.holes}, 1)
      RETURNING id
        `;

    console.log("result of query hehe", result_course_scorecard);

    if (result_course_scorecard[0]) {
      return {
        success: true,
        message: "Game object created !",
        id: result_course_scorecard[0].id,
      };
    } else {
      return { success: false, message: "Create game query not good", id: "" };
    }
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Course upload failed !" };
  }
};

export const getCurrentGames = async (
  cookie: Record<string, Cookie<string | undefined>>
) => {
  try {
    console.log("id for user to get IN-PROGRESS games: ", cookie);

    const access_secret = process.env.JWT_ACCESS_SECRET;

    const accessTokenResult = verifyTokenHelper(
      cookie.accessToken?.value,
      access_secret
    );
    if (accessTokenResult === "BAD_TOKEN" || accessTokenResult === undefined) {
      return {
        success: false,
        message: "Access token error in createGameData",
        id: "",
      };
    }
    const user_id = accessTokenResult.id;
    console.log("user id before get current games: ", user_id);

    const result = await sql<IGameView[]>`
  SELECT 
    g.id,
    g.user_id,
    g.course_id,
    g.status,
    g.score,
    g.par,
    g.holes,
    c.club_name
  FROM games g
  JOIN courses c 
    ON g.course_id = c.id
  WHERE g.status = ${GAME_STATUS.in_progress}
    AND g.user_id = ${user_id};
`;

    console.log("result of get current games query before: ", result);
    const games = [...result];

    console.log("result of get current games query", games);

    return games;
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return [];
  }
};

// simple get a course by its id
// used for 'creating game' page, when we search for courses
export const getCourseById = async (courseBody: string) => {
  console.log("INSIDE GET course poster CONTROLLER");

  try {
    console.log("course search body: ", courseBody);

    const result = await sql`select * from courses where club_name ILIKE ${
      "%" + courseBody + "%"
    }`;

    // console.log("result of query hehe", result);

    return { result };
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Course upload failed !" };
  }
};
