'use client'

import { searchJobs } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { HNJobPostData } from '@/types/job'
import { ArrowUpRightFromSquare } from "lucide-react"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Badge } from './ui/badge'

export default function Search() {
    const [query, setQuery] = useState('')
    const [jobs, setJobs] = useState<HNJobPostData[]>([])
    const [sqlQuery, setSQLQuery] = useState<string>("")

    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // TODO: Catch error
        const [sqlQuery, hnjobs] = await searchJobs(query)
        setJobs(hnjobs)
        setSQLQuery(sqlQuery)

        router.refresh()
        setQuery('')
    }

    return (
        <div className="h-screen flex flex-col items-center justify-between gap-3 my-auto">
            <h1 className="text-4xl font-mono text-center mb-4 mt-4">Job Search</h1>
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
                <code>{sqlQuery}</code>
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
        <ul className="mt-8 space-y-4 pr-5 pl-5">
            {jobs.map((job) => (
                <li key={job.company.name} className="bg-white p-4 rounded-lg">
                    <div className="flex flex-row justify-between items-center">
                        <h2 className="text-xl font-medium text-gray-700">{job.company.name || "No Name"}</h2>
                        <Badge variant={"secondary"} className='text-slate-500 rounded-md'>{job.workTypes.join(" | ")}</Badge>
                    </div>


                    <div className="flex flex-row justify-between">
                        <p className="text-sm text-gray-500 mb-2">{job.company.website} | {job.company.contactEmail || "No contact email provided"}</p>
                    </div>
                    <p className="text-gray-600">{job.company.description}</p>
                    <div className="flex flex-col gap-2">
                        {/* <h3 className="text-md font-medium text-gray-800 mt-4">Locations</h3>
                        <ul className="list-disc pl-6">
                            {job.locations.map((location) => (
                                <li key={location.city} className="text-gray-700">
                                    {[location.city, location.country].filter(l => !!l).join(",")}
                                </li>
                            ))}

                        </ul> */}
                        <div className="mt-4">
                            <h4 className="text-md font-medium leading-none mb-2">Roles</h4>
                            <ul className="list-none pl-6">
                                {job.roles.map((role) => (
                                    <li key={role.title} className="text-sm text-gray-600">
                                        {/* <a href={role.url || '#'} target="_blank" className="inline-flex items-center justify-center text-base p-1 font-medium text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
                                            <span className="w-full">{role.title}</span>
                                            <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                            </svg>
                                        </a> */}
                                        <Button asChild variant={"ghost"} size={"sm"} className="text-sm">
                                            <Link href={role.url || '#'} target='_blank'>

                                                <ArrowUpRightFromSquare className="text-gray-300" />

                                                {role.title}

                                            </Link>


                                        </Button>
                                    </li>
                                ))}

                            </ul>
                        </div>



                        <div className="flex flex-row flex-wrap gap-2 mt-2">
                            {job.skills.map((skill) => <Badge key={skill} variant={"outline"} className="rounded-md text-gray-600">{skill}</Badge>)}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

