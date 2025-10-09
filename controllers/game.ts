import {
  EIGHTEEN_HOLES_MAP,
  type eighteen_hole_card,
  type ICourse,
  type ICourseView,
  type nine_hole_card,
  type THoles,
} from "../types/course";
import sql from "../database/config";
import type { Cookie } from "elysia";
import { verifyTokenHelper } from "../middleware/token";
import {
  GAME_STATUS,
  type Eighteen_Hole_Data,
  type Game_Shot_Data,
  type Hole_Data,
  type ICreateHoles,
  type IGame,
  type IGameBase,
  type IGameMainCall,
  type IGameReturnEight,
  type IGameReturnNine,
  type IGameView,
  type MainGameData,
  type Nine_Hole_Data,
} from "../types/game";
import {
  getCourseData,
  getGameObjectEight,
  getGameObjectNine,
  getScoreCardEight,
  getScoreCardNine,
} from "../middleware/gameData";
import { main } from "bun";
import {
  cleanHoleDataEight,
  cleanHoleDataNine,
  createEightHoles,
  createNineHoles,
} from "../middleware/holeData";

export const createGameData = async (
  body: ICourseView,
  cookie: Record<string, Cookie<string | undefined>>
) => {
  console.log("INSIDE create Game object CONTROLLER");

  try {
    if (!sql) {
      return { success: false, message: "Game creation failed !" };
    }

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

    // console.log("create game, course_id param: ", body);

    const holes: THoles = body.holes;

    // grab course data.
    // cant grab scorecard cause we dont know whe
    const result_course_scorecard = await sql`
      insert into games (user_id, course_id, status, score, par, holes, hole_state)
      VALUES (${user_id},${body.id}, 'IN-PROGRESS', 0, ${body.par}, ${body.holes}, 1)
      RETURNING *
        `;

    // console.log("result of query hehe", result_course_scorecard);

    if (result_course_scorecard[0]) {
      const game_id = result_course_scorecard[0].id;

      // eighteen holes creation
      if (holes === 18) {
        // create hole rows for this game...
        const result = await sql<ICreateHoles<eighteen_hole_card>[]>`
        SELECT *
        FROM eighteen_score_cards
        WHERE course_id = ${body.id};
      `;

        if (result[0]) {
          // score card object
          const score_card = result[0];

          const resulter = await createEightHoles(game_id, user_id, score_card);
          // console.log("result of create eighteen holes: ", resulter);
        }
      }

      // Nine holes creation
      else {
        // create hole rows for this game...
        const result = await sql<ICreateHoles<nine_hole_card>[]>`
        SELECT *
        FROM nine_score_cards
        WHERE course_id = ${body.id};
      `;

        if (result[0]) {
          // score card object
          const score_card = result[0];

          const resulter = await createNineHoles(game_id, user_id, score_card);
          // console.log("result of create nine holes: ", resulter);
        }
      }

      //   const score_card_sorted = getScoreCard(main_q, holes);
      // // sort course data into one object
      // const course_sorted = getCourseData(main_q, holes);

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

// --------
// GET COMPLETE games
// ------

// -----------------
export const getCompleteGames = async (
  cookie: Record<string, Cookie<string | undefined>>
) => {
  try {
    if (!sql) {
      return { success: false, message: "get complete games failed !" };
    }
    // console.log("id for user to get IN-PROGRESS games: ", cookie);

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
    // console.log("user id before get current games: ", user_id);

    const result = await sql<IGameView[]>`
  SELECT 
    g.id,
    g.user_id,
    g.course_id,
    g.status,
    g.score,
    g.par,
    g.holes,
    g.created_at,
    c.club_name
  FROM games g
  JOIN courses c 
    ON g.course_id = c.id
  WHERE g.status = ${GAME_STATUS.complete}
    AND g.user_id = ${user_id};
`;

    // console.log("result of get current games query before: ", result);
    const games = [...result];

    // console.log("result of get current games query", games);

    return games;
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return [];
  }
};
// ------

export const getCurrentGames = async (
  cookie: Record<string, Cookie<string | undefined>>
) => {
  try {
    if (!sql) {
      return { success: false, message: "get current games failed !" };
    }
    // console.log("id for user to get IN-PROGRESS games: ", cookie);

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
    // console.log("user id before get current games: ", user_id);

    const result = await sql<IGameView[]>`
  SELECT 
    g.id,
    g.user_id,
    g.course_id,
    g.status,
    g.score,
    g.par,
    g.holes,
    g.created_at,
    c.club_name
  FROM games g
  JOIN courses c 
    ON g.course_id = c.id
  WHERE g.status = ${GAME_STATUS.in_progress}
    AND g.user_id = ${user_id};
`;

    // console.log("result of get current games query before: ", result);
    const games = [...result];

    // console.log("result of get current games query", games);

    return games;
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return [];
  }
};

// ---------------

// ----------------------------------------------------------------------------------

// Get game data
// Going to grab data from several tables and join it all together...
export const getNineGameById = async (params: { game_id: string }) => {
  console.log("INSIDE GET game poster CONTROLLER");

  try {
    if (!sql) {
      return { success: false, message: "get game by nine id !" };
    }

    const game_id = params.game_id;
    // console.log("game id: ", params.game_id);
    // get game object by sql query
    const result = await getGameObjectNine(game_id);

    if (!result || !result[0]) {
      console.log("First game query object is null or undefined...");
      return null;
    }
    const main_q = result[0];
    // console.log("result of query hehe", [...result]);
    // console.log("result of main game query: ", main_q);

    // sort score card data into one object
    const score_card_sorted = getScoreCardNine(main_q);
    // sort course data into one object
    const course_sorted = getCourseData(main_q);

    // console.log("course_score_card after sorting: ", score_card_sorted);
    // console.log("course_sorted after sorting: ", course_sorted);

    // Grab holes first, cause we need to aggregates shots to holes
    const check_holes = await sql`
      select id, user_id, game_id, hole_number, putt_count, par, score, notes 
      from holes where game_id = ${game_id}
      ORDER BY hole_number
    `;

    // console.log("get holes data HEHEHAHA: ", [check_holes]);

    const holes_array = [...check_holes] as Hole_Data[];

    // get hole + shot data for the game
    const shot_data = await sql`
        SELECT *
        from game_shots
        WHERE game_id = ${game_id}
        ORDER BY hole_id;
    `;
    // console.log("get shots data: ", [...shot_data]);

    const shots_array = [...shot_data] as Game_Shot_Data[];

    // send the data to a function to get cleaned and then send back, in game object...
    const hole_data_return = cleanHoleDataNine(holes_array, shots_array);

    // console.log("clearn shot+hole data: ", hole_data_return);

    // make sure neither score card or hole data are undefined...
    if (!score_card_sorted || !hole_data_return) {
      return { success: false, message: "Course upload failed !" };
    }

    // return three different objects (IGame, Scorecard and Hole_data)
    return {
      game_object: {
        id: main_q?.id,
        course: course_sorted,
        user_id: main_q?.user_id,
        status: main_q?.status,
        date: main_q?.created_at,
        score: main_q?.score,
        hole_state: main_q.hole_state,
        notes: main_q?.notes,
      },
      score_card_data: score_card_sorted,
      hole_data: hole_data_return,
    };
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Course upload failed !" };
  }
};

// EIGHTEEN GAME DATA
//

// --------------------------
export const getEightGameById = async (params: { game_id: string }) => {
  console.log("INSIDE GET game for EIGHT poster CONTROLLER");

  try {
    if (!sql) {
      return { success: false, message: "get game by eight id failed !" };
    }

    const game_id = params.game_id;
    // console.log("game id: ", params.game_id);

    // get game object by sql query
    const result = await getGameObjectEight(game_id);

    if (!result || !result[0]) {
      console.log("First game query object is null or undefined...");
      return null;
    }
    const main_q = result[0];
    // console.log("result of query hehe", [...result]);
    // console.log("result of main game query: ", main_q);

    // sort score card data into one object
    const score_card_sorted = getScoreCardEight(main_q);
    // sort course data into one object
    const course_sorted = getCourseData(main_q);

    // Grab holes first, cause we need to aggregates shots to holes
    const check_holes = await sql`
      select id, user_id, game_id, hole_number, putt_count, par, score, notes 
      from holes where game_id = ${game_id}
      ORDER BY hole_number
    `;

    // console.log("get holes data HEHEHAHA: ", [check_holes]);

    const holes_array = [...check_holes] as Hole_Data[];

    // get hole + shot data for the game
    const shot_data = await sql`
        SELECT *
        from game_shots
        WHERE game_id = ${game_id}
        ORDER BY hole_id;
    `;
    // console.log("get shots data: ", [...shot_data]);

    const shots_array = [...shot_data] as Game_Shot_Data[];

    // send the data to a function to get cleaned and then send back, in game object...
    const hole_data_return = cleanHoleDataEight(holes_array, shots_array);

    // console.log("clearn shot+hole data: ", hole_data_return);

    // make sure neither score card or hole data are undefined...
    if (!score_card_sorted || !hole_data_return) {
      return { success: false, message: "Course upload failed !" };
    }

    // return three different objects (IGame, Scorecard and Hole_data)

    return {
      game_object: {
        id: main_q?.id,
        course: course_sorted,
        user_id: main_q?.user_id,
        status: main_q?.status,
        date: main_q?.created_at,
        score: main_q?.score,
        hole_state: main_q?.hole_state,
        notes: main_q?.notes,
      },
      score_card_data: score_card_sorted,
      hole_data: hole_data_return,
    };
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Course upload failed !" };
  }
};

export const deleteGameById = async (params: { game_id: string }) => {
  console.log("INSIDE GET game for EIGHT poster CONTROLLER");
  try {
    if (!sql) {
      return { success: false, message: "delete game sql object null !" };
    }

    const shot_data = await sql`
        DELETE FROM games
        WHERE id = ${params.game_id};
    `;

    if (!shot_data) {
      return { success: false, message: "Delete game failed !" };
    }

    console.log(`Game with ID: ${params.game_id} has been deleted.`);

    return { success: true, message: "Game deleted" };
  } catch (error) {
    console.log("delete game  controller error: ", error);
    return { success: false, message: "Delete game failed !" };
  }
};
