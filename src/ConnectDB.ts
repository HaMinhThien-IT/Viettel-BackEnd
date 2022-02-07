import { Pool } from "pg";

export const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "200222",
    database: "viettel_store"
});