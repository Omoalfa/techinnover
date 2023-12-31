import { config } from "dotenv";

config();

export const {
  DB_URL, DB_NAME, DB_PORT, DB_USER, DB_PASS, DB_HOST,
  NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS, BATTERY_LOG_DIR,
  LOG_DIR, TEST_PORT, TEST_DB_URL, CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET,
} = process.env;