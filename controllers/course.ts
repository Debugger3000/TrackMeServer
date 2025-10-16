import type {
  eighteen_hole_card,
  ICourse,
  ICourseView,
  THoles,
} from "../types/course";
import sql from "../database/config";

export const postCourseData = async (courseBody: ICourse) => {
  console.log("INSIDE course poster CONTROLLER");

  try {
    if (!sql) {
      return { success: false, message: "Course upload failed !" };
    }
    // console.log("course data body: ", courseBody);

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
        // console.log("nine score card pre insert: ", sc);

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
        // console.log("eighteen score card pre insert: ", sc);

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
    console.log("Scorecard for course created !");

    return { success: true, message: "Course uploaded !" };
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Course upload failed !" };
  }
};

// simple get a course by its id
export const getCourseByClub = async (params: { club_name: string }) => {
  console.log("INSIDE GET course poster CONTROLLER");

  try {
    if (!sql) {
      return { success: false, message: "Course upload failed !" };
    }

    // console.log("course search body: ", params.club_name);

    const result = await sql<
      ICourseView[]
    >`select id, club_name, location, course_name, par, holes from courses where club_name ILIKE ${
      "%" + params.club_name + "%"
    }`;

    const rowData = [...result];
    // console.log("result of COURSE SEARCH", rowData);

    return rowData;
  } catch (error) {
    console.log("PostShotData controller error: ", error);
    return { success: false, message: "Course upload failed !" };
  }
};

// -----------------
// DELETE - course
//

export const deleteCourseById = async (params: {
  course_id: number;
  holes: THoles;
}) => {
  console.log("INSIDE DELETE course controller");

  try {
    if (!sql) {
      return {
        success: false,
        message: "Course delete failed! No SQL connection.",
      };
    }

    const { course_id, holes } = params;

    // check for holes

    // First delete scorecard depending on hole type
    // Try to delete from both tables (only one will match)
    if (holes === 18) {
      await sql`DELETE FROM eighteen_score_cards WHERE course_id = ${course_id}`;
    } else {
      await sql`DELETE FROM nine_score_cards WHERE course_id = ${course_id}`;
    }

    // Now delete the course itself
    const result =
      await sql`DELETE FROM courses WHERE id = ${course_id} RETURNING id`;

    if (result.length === 0) {
      console.log("No course found with that ID.");
      return { success: false, message: "No course found to delete." };
    }

    console.log("Course and related scorecard deleted successfully!");
    return { success: true, message: "Course deleted successfully!" };
  } catch (error) {
    console.log("DeleteCourse controller error:", error);
    return { success: false, message: "Course deletion failed!" };
  }
};


// ----------------
//  GET - courses
// 


export const getAllCourses = async () => {
  console.log("INSIDE GET all courses controller");

  try {
    if (!sql) {
      return { success: false, message: "Failed to fetch courses!" };
    }

    const result = await sql<ICourseView[]>`
      SELECT id, club_name, location, course_name, par, holes
      FROM courses
      ORDER BY club_name, course_name
    `;

    const rowData = [...result];
    console.log("Fetched all courses:", rowData.length);

    console.log("courses grabbed: ", rowData);

    return rowData;
  } catch (error) {
    console.log("GetAllCourses controller error:", error);
    return { success: false, message: "Failed to fetch courses!" };
  }
};

