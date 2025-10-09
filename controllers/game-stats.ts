import type { Cookie } from "elysia";
import sql from "../database/config";
import { verifyTokenHelper } from "../middleware/token";
import type { IGameView } from "../types/game";
import {
  game_data_filter_time,
  type IGame_Shots_Stats,
  type IGame_Stats,
  type IHole_Stats,
  type TTime_Filter,
} from "../types/game-stats";
import {
  getAverageClubDistance,
  getAveragePutts,
  getFairwaysHit,
  getScoringAverage,
  mapShotContactsToArray,
  mapShotsToArray,
  penaltyTaken,
  tallyHoleScores,
} from "../middleware/gameStats";
import type { Indiv_Game_Shots, IShotType } from "../types/shots";
import type { THoles } from "../types/course";

export const getGamesBySearch = async (
  params: { club_name: string },
  cookie: Record<string, Cookie<string | undefined>>
) => {
  console.log("INSIDE GET game by search CONTROLLER");

  try {


    if(!sql){
      return { success: false, message: "get games by search sql object bad failed !" };
    }
    // console.log("game search body: ", params.club_name);

    // GET USER ID

    // console.log("id for user to get games by search: ", cookie);

    const access_secret = process.env.JWT_ACCESS_SECRET;

    const accessTokenResult = verifyTokenHelper(
      cookie.accessToken?.value,
      access_secret
    );
    if (accessTokenResult === "BAD_TOKEN" || accessTokenResult === undefined) {
      return {
        success: false,
        message: "Access token error in get games by search",
        id: "",
      };
    }
    const user_id = accessTokenResult.id;
    console.log("user id before get game by search: ", user_id);

    // -----------------------------------

    const result = await sql<IGameView[]>`
  SELECT g.id,
    g.user_id,
    g.course_id,
    g.status,
    g.score,
    g.par,
    g.holes,
    g.created_at,
    c.club_name
  FROM games g
  JOIN courses c ON g.course_id = c.id
  WHERE c.club_name ILIKE ${"%" + params.club_name + "%"}
    AND g.user_id = ${user_id}
    AND g.status = 'COMPLETE'
`;

    console.log();
    const rowData = [...result];
    // console.log("result of game SEARCH", rowData);

    return rowData;
  } catch (error) {
    console.log("games by search controller error: ", error);
    return { success: false, message: "Games get by search failed !" };
  }
};

export const getGameStats = async (
  params: { timeFilter: string },
  cookie: Record<string, Cookie<string | undefined>>,
  holes: THoles
) => {
  console.log("INSIDE GET game stats CONTROLLER");

  try {

    if(!sql){
      return { success: false, message: "get games stats sql object bad failed !" };
    }
    // console.log("game search body: ", params.timeFilter);

    // GET USER ID
    // console.log("id for user to get games stats: ", cookie);

    const access_secret = process.env.JWT_ACCESS_SECRET;

    const accessTokenResult = verifyTokenHelper(
      cookie.accessToken?.value,
      access_secret
    );
    if (accessTokenResult === "BAD_TOKEN" || accessTokenResult === undefined) {
      return {
        success: false,
        message: "Access token error in get games stats",
        id: "",
      };
    }
    const user_id = accessTokenResult.id;
    // console.log("user id before get games stats: ", user_id);

    // -----------------------------------

    // grab just users game data filtered up whatever date given in the PARAM

    const time_filter =
      game_data_filter_time[params.timeFilter as TTime_Filter];

    const games_result = await sql<IGameView[]>`
  SELECT 
    g.id,
    g.user_id,
    g.course_id,
    g.status,
    g.score,
    g.par,
    g.holes,
    g.created_at
  FROM games g
  WHERE g.user_id = ${user_id}
    AND g.created_at >= NOW() - INTERVAL '${sql(time_filter)}'
    AND status = 'COMPLETE'
    AND g.holes = ${holes}
  ORDER BY g.created_at DESC
`;

    const games_data = [...games_result];
    // console.log("result of game stats SEARCH", games_data);

    // calculate games Played
    const games_played = games_data.length;

    // get scoring average
    const scoring_average: {
      stroke_score: number;
      par_score: number;
    } = getScoringAverage(games_data, games_played);

    // --------------------

    // GET hole data
    const holes_result = await sql<IHole_Stats[]>`
  SELECT 
  h.hole_number,
  h.putt_count,
  h.par,
  h.score
FROM holes h
WHERE h.game_id IN (
  SELECT g.id
  FROM games g
  WHERE g.user_id = ${user_id}
    AND g.holes = ${holes}
    AND g.created_at >= NOW() - INTERVAL '${sql(time_filter)}'
    AND g.status = 'COMPLETE')`;

    // old holes get
    // const holes_result = await sql<IHole_Stats[]>`
    //   SELECT
    //     h.hole_number,
    //     h.putt_count,
    //     h.par,
    //     h.score
    //   FROM holes h
    //   WHERE h.user_id = ${user_id}
    //   AND h.created_at >= NOW() - INTERVAL '${sql(time_filter)}'
    // `;

    const holes_data = holes_result.slice();
    // console.log("result of game stats SEARCH", holes_data);

    const holes_played = holes_result.length;
    // get average putt
    const average_putt = getAveragePutts(holes_result, holes_played);

    // tally hole scores
    const hole_score_distro = tallyHoleScores(holes_result, holes_played);


    // newer one
    const game_shots_result = await sql<IGame_Shots_Stats[]>`
  SELECT 
  gs.shot_count,
  gs.shot_contact,
  gs.shot_path,
  gs.land_type,
  gs.yards,
  gs.stroke,
  gs.club_type
FROM game_shots gs
WHERE gs.game_id IN (
  SELECT g.id
  FROM games g
  WHERE g.user_id = ${user_id}
    AND g.holes = ${holes}
    AND g.created_at >= NOW() - INTERVAL '${sql(time_filter)}'
    AND g.status = 'COMPLETE'
)
ORDER BY gs.created_at DESC`;
    


    // get shots now.....
//     const game_shots_result = await sql<IGame_Shots_Stats[]>`
//   SELECT 
//     gs.shot_count,
//     gs.shot_contact,
//     gs.shot_path,
//     gs.land_type,
//     gs.yards,
//     gs.stroke,
//     gs.club_type
//   FROM game_shots gs
//   WHERE gs.user_id = ${user_id}
//   AND gs.created_at >= NOW() - INTERVAL '${sql(time_filter)}'
//   ORDER BY gs.created_at DESC
// `;

    const game_shot_data = [...game_shots_result];
    // console.log("result of game stats SEARCH", game_shots_result);

    // total shots
    const total_shots = game_shot_data.length;

    // fairways_hit_off_tee
    const fairways_off_tee: {
      fairways: number;
      driver: number;
    } = getFairwaysHit(game_shot_data, total_shots);

    // penalty_percent
    const penalties_percent = penaltyTaken(game_shot_data, total_shots);

    // console.log("score distro: ", hole_score_distro);

    let final_object: IGame_Stats = {
      game_view: games_data,
      games_played: games_played,
      scoring_average: scoring_average.par_score,
      stroke_average: scoring_average.stroke_score,
      holes_played: holes_played,
      total_shots: total_shots,
      putt_average: average_putt,
      fairways_hit_off_tee: fairways_off_tee.fairways,
      longest_drive: fairways_off_tee.driver,
      penalty_percent: penalties_percent,
      scores_distro: hole_score_distro!,
    };

    return final_object;
  } catch (error) {
    console.log("games stats controller error: ", error);
    return { success: false, message: "Games get by search failed !" };
  }
};

// get game shots - For many games (1month - 1 years worth)
export const getManyGameShots = async (
  params: { timeFilter: string },
  cookie: Record<string, Cookie<string | undefined>>,
  club_type: IShotType
) => {
  try {
    if(!sql){
      return { success: false, message: "get many games shots sql object bad failed !" };
    }
    // console.log("game search body: ", params.timeFilter);

    // --------------------------------------
    // GET USER ID

    // console.log("id for user to get games by search: ", cookie);

    const access_secret = process.env.JWT_ACCESS_SECRET;

    const accessTokenResult = verifyTokenHelper(
      cookie.accessToken?.value,
      access_secret
    );
    if (accessTokenResult === "BAD_TOKEN" || accessTokenResult === undefined) {
      return {
        success: false,
        message: "Access token error in get games by search",
        id: "",
      };
    }
    const user_id = accessTokenResult.id;
    // console.log("user id before get game by search: ", user_id);

    // -----------------------------------

    // query
    // --------------------

    const time_filter =
      game_data_filter_time[params.timeFilter as TTime_Filter];

    // get shots now.....
    const game_shots_result = await sql<IGame_Shots_Stats[]>`
  SELECT 
    gs.shot_count,
    gs.shot_contact,
    gs.shot_path,
    gs.land_type,
    gs.yards,
    gs.stroke,
    gs.club_type
  FROM game_shots gs
  WHERE gs.user_id = ${user_id}
  AND gs.club_type = ${club_type}
  AND gs.created_at >= NOW() - INTERVAL '${sql(time_filter)}'
  ORDER BY gs.created_at DESC
`;

    const game_shot_data = [...game_shots_result];
    // console.log("result of game stats SEARCH", game_shots_result);

    // total shots
    const total_shots = game_shot_data.length;

    // penalty_percent
    const penalties_percent = penaltyTaken(game_shot_data, total_shots);

    // average distance and longest shot
    const average_club_distance = getAverageClubDistance(
      game_shot_data,
      total_shots
    );

    // build out object for shot path...
    const shot_path_object = mapShotsToArray(game_shot_data, club_type);

    // build out object for shot contact
    const shot_contact_object = mapShotContactsToArray(
      game_shot_data,
      total_shots
    );

    let final_many_games_shots: Indiv_Game_Shots = {
      total_shots: total_shots,
      average_distance: average_club_distance.average_distance,
      longest_shot: average_club_distance.longest_shot,
      penalties_percent: penalties_percent,
      shot_paths: shot_path_object,
      shot_contact: shot_contact_object,
    };

    //.log("return object for many game shots...", final_many_games_shots);

    return final_many_games_shots;
  } catch (error) {
    console.log("games by search controller error: ", error);
    return { success: false, message: "Games get by search failed !" };
  }
};

// get solo game stats
// get game shots - For many games (1month - 1 years worth)
export const getSoloGameStats = async (
  params: { game_id: string },
  cookie: Record<string, Cookie<string | undefined>>
) => {
  try {
    if(!sql){
      return { success: false, message: "get solo games shots sql object bad failed !" };
    }
    //.log("game search body: ", params.game_id);

    // --------------------------------------
    // GET USER ID

    //.log("id for user to get games by search: ", cookie);

    const access_secret = process.env.JWT_ACCESS_SECRET;

    const accessTokenResult = verifyTokenHelper(
      cookie.accessToken?.value,
      access_secret
    );
    if (accessTokenResult === "BAD_TOKEN" || accessTokenResult === undefined) {
      return {
        success: false,
        message: "Access token error in get games by search",
        id: "",
      };
    }
    const user_id = accessTokenResult.id;
    //.log("user id before get game by search: ", user_id);

    // -----------------------------------

    // query
    // --------------------

    const games_result = await sql<IGameView[]>`
  SELECT 
    g.id,
    g.user_id,
    g.course_id,
    g.status,
    g.score,
    g.par,
    g.holes,
    g.created_at
  FROM games g
  WHERE g.user_id = ${user_id}
    AND g.id = ${params.game_id}
    AND g.status = 'COMPLETE'
  ORDER BY g.created_at DESC
`;

    const games_data = [...games_result];
    // console.log("result of game stats SEARCH", games_data);

    // calculate games Played
    const games_played = games_data.length;

    // get scoring average
    const scoring_average: {
      stroke_score: number;
      par_score: number;
    } = getScoringAverage(games_data, games_played);

    // --------------------

    // GET hole data
    const holes_result = await sql<IHole_Stats[]>`
  SELECT 
    h.hole_number,
    h.putt_count,
    h.par,
    h.score
  FROM holes h
  WHERE h.user_id = ${user_id}
  AND h.game_id = ${params.game_id}
`;

    const holes_data = holes_result.slice();
    // console.log("result of game stats SEARCH", holes_data);

    const holes_played = holes_result.length;
    // get average putt
    const average_putt = getAveragePutts(holes_data, holes_played);

    // tally hole scores
    const hole_score_distro = tallyHoleScores(holes_data, holes_played);

    // get shots now.....
    const game_shots_result = await sql<IGame_Shots_Stats[]>`
  SELECT 
    gs.shot_count,
    gs.shot_contact,
    gs.shot_path,
    gs.land_type,
    gs.yards,
    gs.stroke,
    gs.club_type
  FROM game_shots gs
  WHERE gs.user_id = ${user_id}
  AND gs.game_id = ${params.game_id}
  ORDER BY gs.created_at DESC
`;

    const game_shot_data = [...game_shots_result];
    // console.log("result of game stats SEARCH", game_shots_result);

    // total shots
    const total_shots = game_shot_data.length;

    // fairways_hit_off_tee
    const fairways_off_tee: {
      fairways: number;
      driver: number;
    } = getFairwaysHit(game_shot_data, total_shots);

    // penalty_percent
    const penalties_percent = penaltyTaken(game_shot_data, total_shots);

    //.log("score distro: ", hole_score_distro);

    let final_object: IGame_Stats = {
      game_view: games_data,
      games_played: games_played,
      scoring_average: scoring_average.par_score,
      stroke_average: scoring_average.stroke_score,
      holes_played: holes_played,
      total_shots: total_shots,
      putt_average: average_putt,
      fairways_hit_off_tee: fairways_off_tee.fairways,
      longest_drive: fairways_off_tee.driver,
      penalty_percent: penalties_percent,
      scores_distro: hole_score_distro!,
    };

    return final_object;
  } catch (error) {
    console.log("get SOLO game stats error: ", error);
    return { success: false, message: "Games get by search failed !" };
  }
};

export const getSoloGameShotStats = async (
  params: { game_id: string },
  cookie: Record<string, Cookie<string | undefined>>,
  club_type: IShotType
) => {
  try {
    if(!sql){
      return { success: false, message: "get solo games shots stats sql object bad failed !" };
    }
    //.log("game search body: ", params.game_id);

    // --------------------------------------
    // GET USER ID

    //.log("id for user to get games by search: ", cookie);

    const access_secret = process.env.JWT_ACCESS_SECRET;

    const accessTokenResult = verifyTokenHelper(
      cookie.accessToken?.value,
      access_secret
    );
    if (accessTokenResult === "BAD_TOKEN" || accessTokenResult === undefined) {
      return {
        success: false,
        message: "Access token error in get games by search",
        id: "",
      };
    }
    const user_id = accessTokenResult.id;
    //.log("user id before get game by search: ", user_id);

    // -----------------------------------

    // query
    // --------------------

    // get shots now.....
    const solo_game_shots_result = await sql<IGame_Shots_Stats[]>`
  SELECT 
    gs.shot_count,
    gs.shot_contact,
    gs.shot_path,
    gs.land_type,
    gs.yards,
    gs.stroke,
    gs.club_type
  FROM game_shots gs
  WHERE gs.user_id = ${user_id}
  AND gs.club_type = ${club_type}
  AND gs.game_id = ${params.game_id}
  ORDER BY gs.created_at DESC
`;

    const game_shot_data = [...solo_game_shots_result];
    // console.log("result of game stats SEARCH", game_shots_result);

    // total shots
    const total_shots = game_shot_data.length;

    // penalty_percent
    const penalties_percent = penaltyTaken(game_shot_data, total_shots);

    // average distance and longest shot
    const average_club_distance = getAverageClubDistance(
      game_shot_data,
      total_shots
    );

    // build out object for shot path...
    const shot_path_object = mapShotsToArray(game_shot_data, club_type);

    // build out object for shot contact
    const shot_contact_object = mapShotContactsToArray(
      game_shot_data,
      total_shots
    );

    let final_many_games_shots: Indiv_Game_Shots = {
      total_shots: total_shots,
      average_distance: average_club_distance.average_distance,
      longest_shot: average_club_distance.longest_shot,
      penalties_percent: penalties_percent,
      shot_paths: shot_path_object,
      shot_contact: shot_contact_object,
    };

    //.log("return object for many game shots...", final_many_games_shots);

    return final_many_games_shots;
  } catch (error) {
    console.log("get SOLO game shots stats error: ", error);
    return { success: false, message: "Games get by search failed !" };
  }
};
