
'use server'

import { db } from "@/db";
import { job } from "@/db/schema";
import { HNJobPostData, hnJobPostSchema, Job } from "@/types/job";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateObject, generateText } from "ai";


const QUERY_SYSTEM_PROMPT = `
  You are a SQL query generator for a job search database. You must ONLY generate queries for a single 'hn.job' table with this schema:

  CREATE TABLE hn.job(
    thread_id BIGINT,
    comment_id BIGINT,
    user TEXT NOT NULL,
    content TEXT NOT NULL,
    meta JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
  );

  The 'meta' column structure is:
  {
    company: {
      name: string,
      description: string,
      website: string | null,
      contactEmail: string | null
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

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateSQLFromSearchQuery(searchQuery: string): Promise<string> {
  'use server';

  try {
    const { text: sqlQuery } = await generateText({
      system: QUERY_SYSTEM_PROMPT,
      prompt: `Query: ${searchQuery}`,
      model: anthropic('claude-3-5-sonnet-20241022'),
      temperature: 0,
    });

    if (!sqlQuery) {
      throw new Error('Failed to generate SQL query');
    }
    return sqlQuery;

  } catch (error) {
    console.error("Failed to generate SQL query: ", error);
    throw new Error("Failed to generate SQL query");
  }

}

export async function execSQL(sqlQuery: string): Promise<Job[]> {
  'use server';

  try {

    const result = await db.execute<typeof job.$inferSelect>(sqlQuery);

    return result as Job[];

  } catch (error) {
    console.error(`Failed to execute SQL query: ${sqlQuery}`, error);
    throw new Error("Failed to execute SQL query");
  }

}


// ###########################



const EXTRACT_SYTEM_PROMPT = `
You are a specialized parser designed to extract structured job posting information from Hacker News "Who is Hiring" threads. Your task is to analyze job postings and return data in a specific JSON format.

OUTPUT SCHEMA:
{
  "company": {
    "name": string,           // Company name, required
    "description": string,    // Company description, required (use "" if none)
    "website": string | null, // Company website URL
    "contactEmail": string | null // Email address for applications/contact
  },
  "workTypes": Array<"REMOTE" | "HYBRID" | "ONSITE">, // At least one required
  "locations": Array<{
    "city": string | null,    // City name
    "country": string | null, // Country name
    "region": string | null   // State/Province/Region
  }>,
  "roles": Array<{
    "title": string,         // Job title, required
    "url": string | null,    // Application/job posting URL
    "compensation": {
      "min": number | null,  // Minimum salary
      "max": number | null,  // Maximum salary
      "currency": string | null, // Currency code (e.g., "USD")
      "equity": string | null // Equity information
    }
  }>,
  "skills": string[]         // Array of technologies, languages, frameworks
}

PARSING RULES:

1. Company Information:
   - Extract company name from the first line or prominent mention
   - Capture full company description if provided, else use ""
   - Website should be a valid URL or null
   - ContactEmail should only contain email addresses, not application URLs
   
2. Work Types:
   - REMOTE: Keywords include "remote", "remote-first", "work from home", "remote (US)"
   - HYBRID: Keywords include "hybrid", "flexible location", "partially remote"
   - ONSITE: When specific office locations mentioned without remote options
   - Multiple types allowed (e.g., ["REMOTE", "ONSITE"])
   
3. Locations:
   - Parse each mentioned location into city, country, and region components
   - For US locations: city, state becomes {city: "San Francisco", region: "CA", country: "USA"}
   - For international: Include country name when specified
   - Handle multiple office locations as separate objects
   
4. Roles:
   - Create separate role object for each distinct position
   - Extract complete job titles
   - Include application URLs if provided
   - Parse compensation:
     - Convert salary ranges to numbers (remove currency symbols)
     - Identify equity mentions (e.g., "1-2% equity", "early employee equity")
     
5. Skills:
   - Extract all technical skills, languages, frameworks, platforms
   - Normalize common variations (e.g., "React.js" → "React")
   - Include only technical skills, not soft skills
   
EXTRACTION GUIDELINES:

1. Currency Standardization:
   - Default to "USD" for $ amounts without specified currency
   - Use standard currency codes: "USD", "EUR", "GBP", etc.

2. Salary Parsing:
   - Convert ranges like "$100k-150k" to {min: 100000, max: 150000}
   - Handle various formats: "100-150k", "$100,000+", "up to $200k"

3. Location Normalization:
   - Use full state names or standard abbreviations consistently
   - Handle remote location restrictions (e.g., "Remote (US only)")
   - Include headquarters location even for remote positions

4. Skills Extraction:
   - Include programming languages, frameworks, tools
   - Capture cloud platforms (AWS, GCP, Azure)
   - Include databases, infrastructure tools
   - Standardize variations (e.g., "Postgres"/"PostgreSQL")

Example Output:
{
  "company": {
    "name": "TechCorp",
    "description": "Leading provider of cloud infrastructure solutions",
    "website": "https://techcorp.com",
    "contactEmail": "jobs@techcorp.com"
  },
  "workTypes": ["REMOTE", "HYBRID"],
  "locations": [
    {
      "city": "San Francisco",
      "region": "CA",
      "country": "USA"
    },
    {
      "city": "New York",
      "region": "NY",
      "country": "USA"
    }
  ],
  "roles": [
    {
      "title": "Senior Software Engineer",
      "url": "https://techcorp.com/careers/senior-swe",
      "compensation": {
        "min": 150000,
        "max": 220000,
        "currency": "USD",
        "equity": "0.5-1% equity"
      }
    }
  ],
  "skills": [
    "Python",
    "React",
    "TypeScript",
    "AWS",
    "Kubernetes"
  ]
}

ERROR HANDLING:
- Use null for missing optional values
- Use empty arrays [] for missing arrays
- Use empty string "" for required strings without content
- Maintain consistent casing for technologies and locations
- Skip malformed or incomplete entries that lack minimum required fields

Parse the provided job posting and return a JSON object following this exact schema. Maintain strict compliance with the specified data types and field names.
` as const;

export async function extractDataFromHNJobPost(content: string): Promise<HNJobPostData> {

  try {
    const { object: jobData } = await generateObject({
      system: EXTRACT_SYTEM_PROMPT,
      schema: hnJobPostSchema,
      prompt: `Parse this job post: ${content}`,
      model: anthropic('claude-3-5-sonnet-20241022'),
      temperature: 0,
    });

    if (!jobData) {
      throw new Error('Failed to extract HN job data');
    }
    return jobData;

  } catch (error) {
    console.error("Failed to parse job post: ", error);
    throw new Error("Failed to parse job post");
  }

}