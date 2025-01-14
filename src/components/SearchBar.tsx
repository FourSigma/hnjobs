'use client'

import { searchJobs } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HNJobPostData } from '@/types/job'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Search() {
    const [query, setQuery] = useState('')
    const [jobs, setJobs] = useState<HNJobPostData[]>([])

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // TODO: Catch error
        setJobs(await searchJobs(query))
        router.refresh()
        setQuery('')
    }

    return (
        <div className="h-screen flex flex-col items-center justify-between gap-3 my-auto">
            <h1 className="text-4xl font-mono text-center mb-4">Job Search</h1>
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
            <div className="overflow-y-auto flex-grow">
                <JobResults jobs={jobs} />
            </div>
        </div>
    )
}


function JobResults({ jobs }: { jobs: HNJobPostData[] }) {
    if (jobs.length === 0) {
        return <p className="text-center mt-8 text-gray-600">No jobs found. Try a different search.</p>
    }

    return (
        <ul className="mt-8 space-y-4 w-4/6">
            {jobs.map((job) => (
                <li key={job.company.name} className="bg-white p-4 rounded-lg">
                    <h2 className="text-xl font-medium text-gray-800">{job.company.name || "No Name"}</h2>
                    <p className="text-sm text-gray-500 mb-2">{job.company.website} | {job.company.contactEmail || "No contact email provided"}</p>
                    <p className="text-gray-600">{job.company.description}</p>
                    <div>
                        <h3 className="text-md font-medium text-gray-800 mt-4 mb-2">Work Type</h3>
                        {job.workTypes.join(",")}

                        <h3 className="text-md font-medium text-gray-800 mt-4">Locations</h3>
                        <ul className="list-disc pl-6">
                            {job.locations.map((location) => (
                                <li key={location.city} className="text-gray-700">
                                    {[location.city, location.country].filter(l => !!l).join(",")}
                                </li>
                            ))}

                        </ul>
                        <h3 className="text-md font-medium text-gray-800 mt-4">Roles</h3>
                        <ul className="list-decimal pl-6">
                            {job.roles.map((role) => (
                                <li key={role.title} className="text-gray-700">
                                    <a href={role.url || "#"}>{role.title}</a>
                                </li>
                            ))}

                        </ul>

                        <h3 className="text-md font-medium text-gray-800 mt-4">Skills</h3>
                        <ul className="list-disc pl-6">
                            {job.skills.map((skill) => (
                                <li key={skill} className="text-gray-700">
                                    {skill}
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
            ))}
        </ul>
    )
}

