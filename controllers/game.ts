import type { eighteen_hole_card, ICourse } from "../types/course";
import sql from "../database/config";

export const postCourseData = async (courseBody: ICourse) => {
  console.log("INSIDE course poster CONTROLLER");

  try {
    console.log("course data body: ", courseBody);

    const [result] = await sql`
    `;

    if (result) {
      const course_id = result.id;

      // send score_card data to nine_holes_score_cards
      if (courseBody.holes === 9) {
        const sc = courseBody.score_card;
        console.log("nine score card pre insert: ", sc);

        // now upload the score card for this course...
        const result_nine = await sql`
        `;
      } else {
        const sc = courseBody.score_card as eighteen_hole_card;
        console.log("eighteen score card pre insert: ", sc);

        const result_eighteen = await sql`
        `;
      }
    }

    // console.log("result of query hehe", result);

    return { success: true, message: "Course uploaded !" };
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Course upload failed !" };
  }
};

// simple get a course by its id
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
