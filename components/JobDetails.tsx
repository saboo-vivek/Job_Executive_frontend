
// import React from 'react';
// import { Job, Employer } from '../types';
// import { BriefcaseIcon, CurrencyDollarIcon, MapPinIcon } from './icons';

// interface JobDetailsProps {
//   job: Job;
//   employer: Employer;
//   onApply: (jobId: string) => void;
//   isApplied: boolean;
//   userRole: 'SEEKER' | 'EMPLOYER' | 'admin';
//   onLeaveReview: (companyId: string) => void;
// }

// const JobDetails: React.FC<JobDetailsProps> = ({ job, employer, onApply, isApplied, userRole, onLeaveReview }) => {
//   return (
//     <div className="space-y-6">
//       <div className="flex items-start">
//         <img src={employer.logo} alt={`${employer.name} logo`} className="h-20 w-20 rounded-lg mr-6 object-cover border" />
//         <div>
//           <h2 className="text-3xl font-bold text-neutral">{job.title}</h2>
//           <p className="text-xl text-primary font-semibold">{employer.name}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
//         <div className="flex items-center bg-gray-50 p-3 rounded-lg">
//           <MapPinIcon className="h-6 w-6 mr-3 text-secondary" />
//           <div>
//             <p className="font-semibold">Location</p>
//             <p>{job.location} ({job.locationType})</p>
//           </div>
//         </div>
//         <div className="flex items-center bg-gray-50 p-3 rounded-lg">
//           <CurrencyDollarIcon className="h-6 w-6 mr-3 text-secondary" />
//            <div>
//             <p className="font-semibold">Salary</p>
//             <p>${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}</p>
//           </div>
//         </div>
//         <div className="flex items-center bg-gray-50 p-3 rounded-lg">
//           <BriefcaseIcon className="h-6 w-6 mr-3 text-secondary" />
//           <div>
//             <p className="font-semibold">Experience</p>
//             <p>{job.experienceLevel}</p>
//           </div>
//         </div>
//       </div>
      
//       <div>
//         <h3 className="text-xl font-bold text-neutral mb-2">Job Description</h3>
//         <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
//       </div>

//        <div className="border-t pt-6 flex justify-between items-center">
//          {userRole === 'SEEKER' && (
//             <button 
//                 onClick={() => onLeaveReview(employer.id)}
//                 className="text-secondary font-semibold hover:underline"
//             >
//                 Leave a Review
//             </button>
//          )}
//          <div className={userRole !== 'SEEKER' ? 'w-full text-right' : ''}>
//             <button
//             onClick={() => onApply(job.id)}
//             disabled={isApplied}
//             className={`px-6 py-3 rounded-lg font-bold text-white transition-colors duration-300 ${
//                 isApplied
//                 ? 'bg-gray-400 cursor-not-allowed'
//                 : 'bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
//             }`}
//             >
//             {isApplied ? 'Already Applied' : 'Apply Now'}
//             </button>
//          </div>
//       </div>
//     </div>
//   );
// };

// export default JobDetails;

import React, { useEffect } from "react";
import { Job, Employer } from "../types";
import { BriefcaseIcon, CurrencyDollarIcon, MapPinIcon } from "./icons";

interface JobDetailsProps {
  job: Job;
  employer: Employer;
  onApply: (jobId: string) => void;
  isApplied: boolean;
  userRole: "SEEKER" | "EMPLOYER" | "ADMIN";
  onLeaveReview: (companyId: string) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  employer,
  onApply,
  isApplied,
  userRole,
  onLeaveReview,
}) => {
  // 🔍 Log all props on mount/update
  useEffect(() => {
    console.log("🧩 JobDetails mounted/updated");
    console.log("Job received:", job);
    console.log("Employer received:", employer);
    console.log("isApplied:", isApplied);
    console.log("userRole:", userRole);
  }, [job, employer, isApplied, userRole]);

  if (!job || !employer) {
    console.warn("⚠️ JobDetails missing job or employer", { job, employer });
    return <p className="text-center text-gray-600">Loading job details...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start">
        <img
          src={employer.logo || "https://via.placeholder.com/100"}
          alt={`${employer.name || "Company"} logo`}
          className="h-20 w-20 rounded-lg mr-6 object-cover border"
        />
        <div>
          <h2 className="text-3xl font-bold text-neutral">{job.title}</h2>
          <p className="text-xl text-primary font-semibold">{employer.name}</p>
        </div>
      </div>

      {/* Job Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
          <MapPinIcon className="h-6 w-6 mr-3 text-secondary" />
          <div>
            <p className="font-semibold">Location</p>
            <p>
              {job.location} ({job.locationType})
            </p>
          </div>
        </div>

        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
          <CurrencyDollarIcon className="h-6 w-6 mr-3 text-secondary" />
          <div>
            <p className="font-semibold">Salary</p>
            <p>
              ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
          <BriefcaseIcon className="h-6 w-6 mr-3 text-secondary" />
          <div>
            <p className="font-semibold">Experience</p>
            <p>{job.experienceLevel}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="text-xl font-bold text-neutral mb-2">Job Description</h3>
        <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
      </div>

      {/* Actions */}
      <div className="border-t pt-6 flex justify-between items-center">
        {userRole === "SEEKER" && (
          <button
            onClick={() => {
              console.log("📝 Leave Review clicked for employer:", employer._id || employer.id);
              onLeaveReview(employer._id || employer.id);
            }}
            className="text-secondary font-semibold hover:underline"
          >
            Leave a Review
          </button>
        )}

        <div className={userRole !== "SEEKER" ? "w-full text-right" : ""}>
          <button
            onClick={() => {
              console.log("📤 Apply clicked for job:", job._id || job.id);
              onApply(job._id || job.id);
            }}
            disabled={isApplied}
            className={`px-6 py-3 rounded-lg font-bold text-white transition-colors duration-300 ${
              isApplied
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            }`}
          >
            {isApplied ? "Already Applied" : "Apply Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
