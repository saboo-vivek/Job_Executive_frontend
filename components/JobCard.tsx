import React from "react";
import { Job, Employer, JobType, LocationType } from "../types";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  GlobeAltIcon,
} from "./icons";
import StarRating from "./StarRating";

interface JobCardProps {
  job: Job;
  employer: Employer;
  onApply: (jobId: string) => void;
  onViewDetails: (jobId: string) => void;
  isApplied: boolean;
  status?: string;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  employer,
  onApply,
  onViewDetails,
  isApplied,
  status
}) => {
  const avgRating =
    (employer?.reviews?.length ?? 0) > 0
      ? employer.reviews!.reduce((acc, r) => acc + r.rating, 0) /
        employer.reviews!.length
      : 0;

  // const avgRating = 3;
  // console.log("In Jobcard",job)

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-interactive hover:shadow-interactive-lg hover:-translate-y-1 transition-transform-shadow duration-300 p-6 flex flex-col">
      <div className="flex items-start mb-4">
        <img
          src={employer.logo}
          alt={`${employer.name} logo`}
          className="h-16 w-16 rounded-full mr-4 object-cover border-2 border-primary"
        />
        <div>
          <h3 className="text-xl font-bold text-neutral">{job.title}</h3>
          <p className="text-primary font-semibold">{employer.name}</p>
          <StarRating
            rating={avgRating}
            totalReviews={employer.reviews?.length || 0}
          />
        </div>
      </div>

      <div className="space-y-3 text-gray-600 mb-4 flex-grow">
        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2 text-secondary" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center">
          <CurrencyDollarIcon className="h-5 w-5 mr-2 text-secondary" />
          <span>
            ${job.salaryMin.toLocaleString()} - $
            {job.salaryMax.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center">
          <BriefcaseIcon className="h-5 w-5 mr-2 text-secondary" />
          <span>{job.experienceLevel}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          {job.jobType}
        </span>
        <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-1 rounded-full">
          {job.locationType}
        </span>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <button
          onClick={() => onViewDetails(job._id)}
          className="text-primary font-semibold hover:underline"
        >
          View Details
        </button>

        <button
          onClick={() => onApply(job._id)}
          disabled={isApplied}
          className={`px-4 py-2 rounded-md font-bold text-white transition-colors duration-300 ${
            isApplied
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          }`}
        >
          {isApplied ? (status ? `Status: ${status}` : "Applied") : "Apply Now"}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
