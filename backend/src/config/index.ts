import * as dotenv from "ts-dotenv";

export default dotenv.load({
  PORT: {
    type: Number,
    default: 3001,
  },
  GOOGLE_ID: String,
  GOOGLE_SECRET: String,
  MARVIN_ID: String,
  MARVIN_SECRET: String,
  JWT_SECRET: String,
  JWT_ALGORITHM: {
    type: String,
    default: "HS256",
  },
  JWT_EXPIRATION: {
    type: String,
    default: "15m",
  },
  REFRESH_TOKEN_LENGTH: {
    type: Number,
    default: 40,
  },
  PHASE_TOKEN_LENGTH: {
    type: Number,
    default: 80,
  },
} as const);
