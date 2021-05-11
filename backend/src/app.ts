import { load } from 'ts-dotenv';

export const env = load({
  GOOGLE_ID: String,
  GOOGLE_SECRET: String,
  MARVIN_ID: String,
  MARVIN_SECRET: String,
  JWT_SECRET: String,
});