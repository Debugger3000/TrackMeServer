import type { eighteen_hole_card, ICourse } from "../types/course";
import sql from "../database/config";

export const postCourseData = async (courseBody: ICourse) => {
  console.log("INSIDE course poster CONTROLLER");

  try {
    console.log("course data body: ", courseBody);

    const [result] = await sql`
    insert into courses (club_name, location, course_name, par, holes)
    VALUES (${courseBody.club_name},${courseBody.location},${courseBody.course_name},${courseBody.par},${courseBody.holes})
    RETURNING id
    `;

    if (result) {
      const course_id = result.id;

      // send score_card data to nine_holes_score_cards
      if (courseBody.holes === 9) {
        const sc = courseBody.score_card;
        console.log("nine score card pre insert: ", sc);

        // now upload the score card for this course...
        const result_nine = await sql`
        INSERT INTO nine_score_cards (
            course_id, hole_one, hole_two, hole_three, hole_four, hole_five,
            hole_six, hole_seven, hole_eight, hole_nine
        ) VALUES (${course_id}, ${sc.hole_one}, ${sc.hole_two}, ${sc.hole_three},
        ${sc.hole_four}, ${sc.hole_five}, ${sc.hole_six}, ${sc.hole_seven},
        ${sc.hole_eight}, ${sc.hole_nine})
        `;
      } else {
        const sc = courseBody.score_card as eighteen_hole_card;
        console.log("eighteen score card pre insert: ", sc);

        const result_eighteen = await sql`
        INSERT INTO eighteen_score_cards (
            course_id,
            hole_one, hole_two, hole_three, hole_four, hole_five,
            hole_six, hole_seven, hole_eight, hole_nine, hole_ten,
            hole_eleven, hole_twelve, hole_thirteen, hole_fourteen, hole_fifteen,
            hole_sixteen, hole_seventeen, hole_eighteen
        ) VALUES (
            ${course_id},
            ${sc.hole_one}, ${sc.hole_two}, ${sc.hole_three}, ${sc.hole_four}, ${sc.hole_five},
            ${sc.hole_six}, ${sc.hole_seven}, ${sc.hole_eight}, ${sc.hole_nine}, ${sc.hole_ten},
            ${sc.hole_eleven}, ${sc.hole_twelve}, ${sc.hole_thirteen}, ${sc.hole_fourteen}, ${sc.hole_fifteen},
            ${sc.hole_sixteen}, ${sc.hole_seventeen}, ${sc.hole_eighteen}
        )
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

export const getCourse = async (courseBody: string) => {
  console.log("INSIDE GET course poster CONTROLLER");

  try {
    console.log("course search body: ", courseBody);

    const result = await sql``;

    // console.log("result of query hehe", result);

    return { success: true, message: "Course uploaded !" };
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Course upload failed !" };
  }
};
