

// import postgres from "postgres";

// const connectionString = process.env.DATABASE_URL!;

// console.log("Connection string: ", connectionString);
// let sql = postgres(connectionString, {
//   ssl: { rejectUnauthorized: false },
//   max: 1,
//   max_lifetime: 0,
//   idle_timeout: 0,
//   prepare: false,
//   connect_timeout: 10,
//   // ssl: 'require',
// });



// async function healthCheck(retries = 10, delay = 15000): Promise<void> {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       const [healthResult] = await sql`SELECT 1;`; // basic test query
//       console.log("✅ Connected to Supabase PostgreSQL");
//       console.log("'result of health check: ", healthResult);
//       return;
//     } catch (err) {
//       console.error(`❌ DB connection failed (attempt ${attempt}/${retries})`, err);
//       if (attempt < retries) {
//         console.log(`Retrying in ${delay}s...`);
//         await new Promise((res) => setTimeout(res, delay));
//       } else {
//         console.error("❌ Exhausted retries, exiting.");
//         process.exit(1); // fail fast, or throw if you prefer
//       }
//     }
//   }
// }

// await healthCheck();


// // start a cron job connection checker every now and then, to re-establish a database connection if it gets dropped
// async function monitorConnection(interval = 30000) {
//   setInterval(async () => {
//     try {
//       await sql`SELECT 1;`;
//     } catch (err) {
//       console.warn("⚠️ DB connection unhealthy, reinitializing...");
//       sql = postgres(connectionString, {
//   ssl: { rejectUnauthorized: false },
//   max: 10,
//   max_lifetime: 60,
//   idle_timeout: 30,
//   prepare: false,
//   connect_timeout: 10,
//   // ssl: 'require',
// });
//     }
//   }, interval);
// }
// monitorConnection();



// // console.log("connected to supabase POSTGRESSQL");


// export default sql;






import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
console.log("Connection string: ", connectionString);

let sql: postgres.Sql | null = null;

// Function to initialize/re-initialize the connection
async function initConnection(): Promise<postgres.Sql> {
  if (sql) return sql; // already connected
  sql = postgres(connectionString, {
    ssl: { rejectUnauthorized: false },
    max: 1,             // single persistent connection
    idle_timeout: 0,    // never close idle
    max_lifetime: 0,    // don't recycle automatically
    prepare: false,
    connect_timeout: 10,
  });
  return sql;
}

// Health check at startup
export async function healthCheck(retries = 10, delay = 15000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await initConnection();
      const [res] = await conn`SELECT 1;`;
      console.log("✅ Connected to Supabase PostgreSQL (startup health check)");
      return;
    } catch (err) {
      console.error(`⚠️ DB connection failed (attempt ${attempt}/${retries})`, err);
      if (attempt < retries) {
        console.log(`Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.warn("❌ Exhausted retries, continuing without exiting. Will rely on monitorConnection.");
      }
    }
  }
}

// Monitor function: check connection every interval
export async function monitorConnection(interval = 30_000) {
  setInterval(async () => {
    try {
      const conn = await initConnection();
      await conn`SELECT 1;`;
      console.log("🟢 DB connection is still alive");
    } catch (err) {
      console.warn("⚠️ DB connection unhealthy, attempting to reconnect...", err);
      try {
        sql = null; // reset connection
        await initConnection();
        console.log("🔄 DB reconnection successful");
      } catch (reconnectErr) {
        console.error("❌ DB reconnection failed, will retry in next interval", reconnectErr);
      }
    }
  }, interval);
}

// Initialize connection immediately
await initConnection();
// perform health check
// try a connection
await healthCheck();

// Start the monitor loop
monitorConnection();

// Export the sql client
export default sql;
