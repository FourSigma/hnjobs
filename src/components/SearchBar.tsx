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
                        <p className="text-sm text-gray-500 mb-2">{[job.company.website, job.company.contactEmail].filter(d => !!d).join(" | ")}</p>
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
                            <h4 className="text-sm font-semibold leading-none mb-4 text-gray-600">Locations</h4>
                            <ul className="list-none pl-6">
                                {job.locations.map((loc) => (
                                    <li key={loc.city} className="text-sm text-gray-600">
                                        <Badge variant={"secondary"} className="rounded-lg text-gray-600">
                                            {loc.city}, {loc.country}
                                        </Badge>
                                    </li>
                                ))}

                            </ul>
                        </div>


                        <div className="mt-2">
                            <h4 className="text-sm font-semibold leading-none mb-2 text-gray-600">Roles</h4>
                            <ul className="list-none pl-6">
                                {job.roles.map((role) => (
                                    <li key={role.title} className="text-sm text-gray-600">
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



                        <div className="flex flex-row flex-wrap gap-3 mt-2">
                            {job.skills.map((skill) => <Badge key={skill} variant={"outline"} className="rounded-lg text-gray-600">{skill}</Badge>)}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}

