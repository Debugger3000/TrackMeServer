

import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

// console.log("Connection string: ", connectionString);
let sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 10,
  max_lifetime: 60,
  idle_timeout: 30,
  prepare: false,
  connect_timeout: 10,
  // ssl: 'require',
});



async function healthCheck(retries = 10, delay = 15000): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const [healthResult] = await sql`SELECT 1;`; // basic test query
      console.log("✅ Connected to Supabase PostgreSQL");
      console.log("'result of health check: ", healthResult);
      return;
    } catch (err) {
      console.error(`❌ DB connection failed (attempt ${attempt}/${retries})`, err);
      if (attempt < retries) {
        console.log(`Retrying in ${delay}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.error("❌ Exhausted retries, exiting.");
        process.exit(1); // fail fast, or throw if you prefer
      }
    }
  }
}

await healthCheck();


// start a cron job connection checker every now and then, to re-establish a database connection if it gets dropped
async function monitorConnection(interval = 30000) {
  setInterval(async () => {
    try {
      await sql`SELECT 1;`;
    } catch (err) {
      console.warn("⚠️ DB connection unhealthy, reinitializing...");
      sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 10,
  max_lifetime: 60,
  idle_timeout: 30,
  prepare: false,
  connect_timeout: 10,
  // ssl: 'require',
});
    }
  }, interval);
}
monitorConnection();



// console.log("connected to supabase POSTGRESSQL");


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

