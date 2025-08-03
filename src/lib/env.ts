import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url().optional(),
    DIRECT_URL: z.string().url().optional(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.preprocess(
      // This makes Netlify deployments not fail if you don't set NEXTAUTH_URL
      (str) => process.env.NETLIFY_URL ?? str,
      // NETLIFY_URL doesn't include `https` so it cant be validated as a URL
      process.env.NETLIFY ? z.string().min(1) : z.string().url()
    ),
    
    // Firebase Admin SDK
    FIREBASE_PROJECT_ID: z.string().min(1),
    FIREBASE_CLIENT_EMAIL: z.string().email().optional(),
    FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),
    
    // Redis
    REDIS_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
    
    // File Storage
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1).optional(),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1).optional(),
    CLOUDFLARE_R2_ENDPOINT: z.string().url().optional(),
    
    // Email
    RESEND_API_KEY: z.string().min(1).optional(),
    RESEND_FROM_EMAIL: z.string().email().optional(),
    
    // SMS
    TWILIO_ACCOUNT_SID: z.string().min(1).optional(),
    TWILIO_AUTH_TOKEN: z.string().min(1).optional(),
    TWILIO_PHONE_NUMBER: z.string().min(1).optional(),
    
    // 3CX
    CX_SERVER_URL: z.string().url().optional(),
    CX_API_KEY: z.string().min(1).optional(),
    CX_USERNAME: z.string().min(1).optional(),
    CX_PASSWORD: z.string().min(1).optional(),
    
    // DocuSign
    DOCUSIGN_INTEGRATION_KEY: z.string().min(1).optional(),
    DOCUSIGN_USER_ID: z.string().min(1).optional(),
    DOCUSIGN_ACCOUNT_ID: z.string().min(1).optional(),
    DOCUSIGN_BASE_PATH: z.string().url().optional(),
    DOCUSIGN_PRIVATE_KEY: z.string().min(1).optional(),
    
    // MLS
    MLS_LOGIN_URL: z.string().url().optional(),
    MLS_USERNAME: z.string().min(1).optional(),
    MLS_PASSWORD: z.string().min(1).optional(),
    MLS_USER_AGENT: z.string().min(1).optional(),
    
    // Monitoring
    SENTRY_DSN: z.string().url().optional(),
    
    // Security
    ENCRYPTION_KEY: z.string().min(32).optional(),
    JWT_SECRET: z.string().min(1),
    WEBHOOK_SECRET: z.string().min(1).optional(),
    
    // Rate Limiting
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
    
    // Netlify
    NETLIFY_SITE_ID: z.string().min(1).optional(),
    NETLIFY_AUTH_TOKEN: z.string().min(1).optional(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]).default("development"),
    
    // Firebase Client Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1),
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: z.string().min(1).optional(),
    
    // Other services
    NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL: z.string().url().optional(),
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).optional(),
    
    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS: z.coerce.boolean().default(true),
    NEXT_PUBLIC_ENABLE_PWA: z.coerce.boolean().default(true),
    NEXT_PUBLIC_ENABLE_OFFLINE_MODE: z.coerce.boolean().default(true),
    NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS: z.coerce.boolean().default(true),
    NEXT_PUBLIC_USE_FIREBASE_AUTH: z.coerce.boolean().default(true),
    NEXT_PUBLIC_USE_FIREBASE_STORAGE: z.coerce.boolean().default(true),
    
    // Development
    NEXT_PUBLIC_DEBUG_MODE: z.coerce.boolean().default(false),
    NEXT_PUBLIC_MOCK_DATA: z.coerce.boolean().default(false),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    
    // Firebase
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    
    // Firebase Admin
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
    
    // Redis
    REDIS_URL: process.env.REDIS_URL,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    
    // File Storage
    CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT,
    NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL,
    
    // Email
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    
    // SMS
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
    
    // 3CX
    CX_SERVER_URL: process.env.CX_SERVER_URL,
    CX_API_KEY: process.env.CX_API_KEY,
    CX_USERNAME: process.env.CX_USERNAME,
    CX_PASSWORD: process.env.CX_PASSWORD,
    
    // DocuSign
    DOCUSIGN_INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY,
    DOCUSIGN_USER_ID: process.env.DOCUSIGN_USER_ID,
    DOCUSIGN_ACCOUNT_ID: process.env.DOCUSIGN_ACCOUNT_ID,
    DOCUSIGN_BASE_PATH: process.env.DOCUSIGN_BASE_PATH,
    DOCUSIGN_PRIVATE_KEY: process.env.DOCUSIGN_PRIVATE_KEY,
    
    // Google Maps
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    
    // MLS
    MLS_LOGIN_URL: process.env.MLS_LOGIN_URL,
    MLS_USERNAME: process.env.MLS_USERNAME,
    MLS_PASSWORD: process.env.MLS_PASSWORD,
    MLS_USER_AGENT: process.env.MLS_USER_AGENT,
    
    // Monitoring
    SENTRY_DSN: process.env.SENTRY_DSN,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    
    // Security
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    
    // Rate Limiting
    RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS,
    RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
    
    // App Configuration
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    
    // Feature Flags
    NEXT_PUBLIC_ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS,
    NEXT_PUBLIC_ENABLE_PWA: process.env.NEXT_PUBLIC_ENABLE_PWA,
    NEXT_PUBLIC_ENABLE_OFFLINE_MODE: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE,
    NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS,
    NEXT_PUBLIC_USE_FIREBASE_AUTH: process.env.NEXT_PUBLIC_USE_FIREBASE_AUTH,
    NEXT_PUBLIC_USE_FIREBASE_STORAGE: process.env.NEXT_PUBLIC_USE_FIREBASE_STORAGE,
    
    // Development
    NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
    NEXT_PUBLIC_MOCK_DATA: process.env.NEXT_PUBLIC_MOCK_DATA,
    
    // Netlify
    NETLIFY_SITE_ID: process.env.NETLIFY_SITE_ID,
    NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN,
  },
  /**
   * Run `build` or `dev` with SKIP_ENV_VALIDATION to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});