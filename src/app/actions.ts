'use server'

import { Job } from '@/types/job';

export async function searchJobs(query: string): Promise<Job[]> {
    if (!query) return [];

    return [
        {
            id: '1',
            title: 'Frontend Developer',
            company: 'TechCorp',
            location: 'Remote',
            description: 'We are looking for a skilled Frontend Developer to join our team...'
        },
        {
            id: '2',
            title: 'Backend Engineer',
            company: 'DataSystems',
            location: 'New York, NY',
            description: 'Seeking an experienced Backend Engineer to work on our cloud infrastructure...'
        },
        {
            id: '3',
            title: 'UX Designer',
            company: 'CreativeSolutions',
            location: 'San Francisco, CA',
            description: 'Join our design team to create beautiful and intuitive user experiences...'
        },
        {
            id: '4',
            title: 'Frontend Developer',
            company: 'TechCorp',
            location: 'Remote',
            description: 'We are looking for a skilled Frontend Developer to join our team...'
        },
        {
            id: '5',
            title: 'Backend Engineer',
            company: 'DataSystems',
            location: 'New York, NY',
            description: 'Seeking an experienced Backend Engineer to work on our cloud infrastructure...'
        },
        {
            id: '6',
            title: 'UX Designer',
            company: 'CreativeSolutions',
            location: 'San Francisco, CA',
            description: 'Join our design team to create beautiful and intuitive user experiences...'
        }
    ].filter(job =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase())
    )
}

