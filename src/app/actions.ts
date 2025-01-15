'use server'

import { HNJobPostData } from '@/types/job';
import { execSQL, generateSQLFromSearchQuery } from './service';


export async function searchJobs(searchQuery: string): Promise<[string, HNJobPostData[]]> {
    if (!searchQuery) return ["", []];

    const sqlQuery = await generateSQLFromSearchQuery(searchQuery);

    const results = await execSQL(sqlQuery)
    const jobMetaData = results.map((r) => r.meta);


    return [sqlQuery, jobMetaData];
}

