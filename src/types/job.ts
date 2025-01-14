import { JobSelect } from '@/db/schema';

export type Job = JobSelect


// HN Job Post Zod Schema

import { z } from "zod";

const workTypeEnum = z.enum(["REMOTE", "HYBRID", "ONSITE"]).describe("Type of work arrangement offered");

const locationSchema = z.object({
    city: z.string().nullable().describe("City name where the role is located"),
    country: z.string().nullable().describe("Country name where the role is located"),
    region: z.string().nullable().describe("State, province, or region where the role is located")
});

const compensationSchema = z.object({
    min: z.number().nullable().describe("Minimum salary offered for the role"),
    max: z.number().nullable().describe("Maximum salary offered for the role"),
    currency: z.string().nullable().describe("Currency code for the salary (e.g., 'USD', 'EUR')"),
    equity: z.string().nullable().describe("Equity compensation details (e.g., '0.1-1%')")
});

const roleSchema = z.object({
    title: z.string().min(1).describe("Job title for the role"),
    url: z.string().url().nullable().describe("URL to the job posting or application"),
    compensation: compensationSchema
});

export const hnJobPostSchema = z.object({
    company: z.object({
        name: z.string().min(1).describe("Name of the company"),
        description: z.string().describe("Description of the company and what they do"),
        website: z.string().url().nullable().describe("Company's website URL"),
        contactEmail: z.string().email().nullable().describe("Email address for job applications or inquiries")
    }).describe("Company information"),

    workTypes: z.array(workTypeEnum).min(1).describe("Types of work arrangements available"),

    locations: z.array(locationSchema).describe("Physical locations where the role can be performed"),

    roles: z.array(roleSchema).min(1).describe("Available job positions"),

    skills: z.array(z.string()).describe("Technical skills, technologies, and tools required")
}).strict();

export type HNJobPostData = z.infer<typeof hnJobPostSchema>;