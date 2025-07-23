import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';


export default defineConfig({
  dialect: 'sqlite',
  out: './drizzle',
  schema: './src/schema.ts',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CF_ACCOUNT_ID!,
    databaseId: process.env.CF_D1_DB_ID!,
    token: process.env.CF_API_TOKEN!,
  },
});
