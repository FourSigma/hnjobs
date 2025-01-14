
'use server'

import { anthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";


const SYSTEM_PROMPT = `
  You are a SQL query generator for a job search database. You must ONLY generate queries for a single 'jobs' table with this schema:

  CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    meta JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  The 'meta' column structure is:
  {
    company: {
      name: string,
      description: string,
      website: string | null,
      contact_email: string | null
    },
    workTypes: Array<"REMOTE" | "HYBRID" | "ONSITE">,
    locations: Array<{
      city: string | null,
      country: string | null,
      region: string | null
    }>,
    roles: Array<{
      title: string,
      url: string | null,
      compensation: {
        min: number | null,
        max: number | null,
        currency: string | null,
        equity: string | null
      }
    }>,
    skills: string[]
  }

  RULES:
  1. Only use the meta column and created_at for queries
  2. DO NOT use JOINs or other tables
  3. Always include "ORDER BY created_at DESC LIMIT 20" unless specified otherwise
  4. Use JSONB operators (?>, ?, @>, etc.) for efficient querying
  5. Only return the SQL query without any explanation
  6. Use ILIKE for case-insensitive text searching
  7. When searching arrays, use the ? operator for exact matches
  8. When searching nested objects, use ->>'field' for text and ->'field' for objects
  9. Always handle NULL values appropriately
` as const;

export async function generateSQLFromSearchQuery(searchQuery: string): Promise<string> {

    const { text: sqlQuery } = await generateText({
        system: SYSTEM_PROMPT,
        prompt: `Query: ${searchQuery}`,
        model: anthropic('claude-3-5-sonnet-20241022'),
        temperature: 0,
    });

    if (!sqlQuery) {
        throw new Error('Failed to generate SQL query');
    }

    return sqlQuery;
}