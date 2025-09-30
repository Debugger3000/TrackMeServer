// // db.ts
// import { Client } from "pg";

// console.log("Connecting to Postgres database: ", process.env.DATABASE_URL);

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });

// await client.connect();

// console.log("Connected to Postgres database");

// export default client;

import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;
console.log("Connection string: ", connectionString);
const sql = postgres(connectionString, {
  // ssl: { rejectUnauthorized: false },
  ssl: 'require',
});

console.log("connected to supabase POSTGRESSQL");

// const testConnection = async () => {
//   try {
//     // Simple query to see if DB responds
//     const [res] = await sql`SELECT NOW()`;
//     console.log("✅ Connected! Current DB time:", res);
//   } catch (err) {
//     console.error("❌ Connection failed:", err);
//   }
// };

// testConnection();

export default sql;
