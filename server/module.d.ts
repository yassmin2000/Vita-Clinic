declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET_KEY: string;
    JWT_REFRESH_TOKEN_KEY: string;
    SWAGGER_PASSWORD: string;
    SENDGRID_API_KEY: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_PHONE_NUMBER: string;
  }
}
