import { config } from "dotenv";

config({ path: './../../.env' })

const knexConfig = {
  client: 'pg',
  connection: process.env.NODE_ENV === "test" ? process.env.TEST_DB_URL : process.env.DB_URL ,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: 'migrations',
    extensions: "ts",
  },
  timezone: 'UTC'
};

export default knexConfig;
