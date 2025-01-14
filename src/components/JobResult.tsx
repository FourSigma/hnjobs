import { Job } from '@/types/job'

export default function JobResults({ jobs }: { jobs: Job[] }) {
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

