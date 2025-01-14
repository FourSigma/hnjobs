'use client'

import { searchJobs } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Job } from '@/types/job'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Search() {
    const [query, setQuery] = useState('')
    const [jobs, setJobs] = useState<Job[]>([])

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // TODO: Catch error
        setJobs(await searchJobs(query))
        router.refresh()
        setQuery('')
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-row gap-2 w-full">
                <Input
                    type="text"
                    placeholder="Search for jobs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow"
                />
                <Button type="submit">Search</Button>
            </form>
            <JobResults jobs={jobs} />
        </>
    )
}


function JobResults({ jobs }: { jobs: Job[] }) {
    if (jobs.length === 0) {
        return <p className="text-center mt-8 text-gray-600">No jobs found. Try a different search.</p>
    }

    return (
        <ul className="mt-8 space-y-4 w-4/6">
            {jobs.map((job) => (
                <li key={job.id} className="bg-white p-4 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>
                    <p className="text-gray-600">{job.company}</p>
                    <p className="text-sm text-gray-500 mt-2">{job.location}</p>
                    <p className="mt-2 text-gray-700">{job.description}</p>
                </li>
            ))}
        </ul>
    )
}

