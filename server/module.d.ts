declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    JWT_SECRET_KEY: string;
    JWT_REFRESH_TOKEN_KEY: string;
    SWAGGER_PASSWORD: string;
    SWAGGER_CONTACT_NAME: string;
    SWAGGER_CONTACT_URL: string;
    SWAGGER_CONTACT_EMAIL: string;
    SWAGGER_FAV_ICON_URL: string;
    SENDGRID_API_KEY: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_PHONE_NUMBER: string;
    FASTAPI_URL: string;
    FASTAPI_API_KEY: string;
  }
}
