

import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;



console.log("Connection string: ", connectionString);
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 10,
  // ssl: 'require',
});

console.log("connected to supabase POSTGRESSQL");


export default sql;


// Retry configuration
// const MAX_RETRIES = 5;        // max attempts
// const RETRY_DELAY_MS = 1000;  // wait 1 second between retries

// async function createSQLConnection() {
//   let attempt = 0;
//   while (attempt < MAX_RETRIES) {
//     try {
//       const sql = postgres(connectionString, {
//         ssl: { rejectUnauthorized: false },
//         max: 10, // optional: limit max pool size
//       });

//       // Test the connection
//       await sql`SELECT 1`;
//       console.log("✅ Connected to Supabase PostgreSQL");
//       return sql;
//     } catch (err: any) {
//       attempt++;
//       console.warn(`⚠️ DB connection attempt ${attempt} failed: ${err.message}`);
//       if (attempt >= MAX_RETRIES) {
//         console.error("❌ Could not connect to DB after multiple attempts");
//         throw err;
//       }
//       // Wait before retrying
//       await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
//     }
//   }
// }

// // Export a promise that resolves to the connected sql client
// const sqlPromise = createSQLConnection();
// export default sqlPromise;

