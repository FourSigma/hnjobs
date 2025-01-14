import { extractDataFromHNJobPost } from "@/app/service";
import { Job } from "@/types/job";
import { sql } from "drizzle-orm";
import { db } from ".";
import { job } from "./schema";

// TODO(siva): Hardcoded the lastest whoishiring threadId for now. 
// Should ideally be CLI argument to load. Fix later. 
extractRawJobPosts(42575537)
    .then((rawJobs) => transformAndLoadJob(rawJobs))
    .catch((err) => console.error(err));


// Raw job posting from HN API
type RawJobPosting = {
    by: string,
    id: number,
    parent: number,
    text: string,
    time: number,
    type: string,
}


// Fetches the raw job postings from a "Who is hiring?" thread 
export async function extractRawJobPosts(threadId: number): Promise<RawJobPosting[]> {
    const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${threadId}.json`);
    const thread = await response.json() as { by: string, kids: number[], title: string };

    if (thread.by !== 'whoishiring') {
        throw new Error('Author: Thread is not a "Who is hiring?" thread');
    }

    if (!thread.title.toLowerCase().includes('who is hiring')) {
        throw new Error('Title: Thread is not a "Who is hiring?" thread');
    }

    const totalJobs = thread.kids.length;

    const rawJobs: RawJobPosting[] = [];
    for (const [i, id] of thread.kids.entries()) {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
        rawJobs.push(await response.json());

        console.log(`Fetched job ${i + 1} of ${totalJobs}`);
        // Artificial delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    return rawJobs;
}

// TODO(siva): Make this parallel. Taking too long.  
export async function transformAndLoadJob(rawJobs: RawJobPosting[]): Promise<Job[]> {

    const jobs: Job[] = [];
    for (const [i, rj] of rawJobs.entries()) {
        const meta = await extractDataFromHNJobPost(rj.text);
        const job = {
            thread_id: rj.parent,
            comment_id: rj.id,
            user: rj.by,
            content: rj.text,
            meta,
            createdAt: new Date(rj.time * 1000),
        }
        await loadProcessedJob(job);
        console.log(`Transformed and loaded job ${i + 1} of ${rawJobs.length}`);
    }

    return jobs;
}

export async function loadProcessedJob(j: Job): Promise<void> {
    await db.insert(job).values(j).onConflictDoUpdate({ target: [job.thread_id, job.comment_id], set: { meta: sql`EXCLUDED.meta` } });
}