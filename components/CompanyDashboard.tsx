import React, { useState, useEffect } from "react";
import { Employer, Job, JobSeeker } from "../types";
import Modal from "./Modal";
import CompanyProfileEdit from "./CompanyProfileEdit";
import PostJobForm from "./PostJobForm";
import { PencilIcon, PlusCircleIcon, BriefcaseIcon } from "./icons";
import * as api from "../services/apiService";

interface CompanyDashboardProps {
  employer: Employer;
  jobs: Job[];
  seekers: JobSeeker[];
  onSaveProfile: (updatedCompany: Employer) => void;
  onSaveJob: (job: Omit<Job, "id" | "applicants" | "shortlisted" | "rejected">) => void;
}

const CompanyDashboard: React.FC<CompanyDashboardProps> = ({
  employer,
  jobs,
  seekers,
  onSaveProfile,
  onSaveJob,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [viewingApplicantsForJob, setViewingApplicantsForJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  // ✅ Handle Profile Save
  const handleSaveProfile = async (updatedCompany: Employer) => {
    try {
      await onSaveProfile(updatedCompany);
      alert("✅ Profile updated successfully!");
      setIsEditModalOpen(false);
    } catch {
      alert("❌ Failed to update profile");
    }
  };

  // ✅ Handle Job Creation
  const handleSaveJob = async (
    jobData: Omit<Job, "id" | "applicants" | "shortlisted" | "rejected">
  ) => {
    try {
      const newJob = await api.createJob(jobData);
      alert("✅ Job posted successfully");
      setIsPostJobModalOpen(false);
      onSaveJob(newJob);
    } catch (err: any) {
      alert(err?.response?.data?.msg || "❌ Failed to post job");
    }
  };

  // ✅ Handle Job Deletion
  const handleDeleteJob = async (jobId: string) => {
    if (!jobId) {
      alert("Job ID missing!");
      return;
    }

    if (confirm("Are you sure you want to delete this job?")) {
      try {
        await api.deleteJob(jobId);
        alert("🗑️ Job deleted successfully!");
        window.location.reload();
      } catch (err: any) {
        alert(err?.response?.data?.msg || "❌ Failed to delete job");
      }
    }
  };

  // ✅ View Applicants (open modal)
  const handleViewApplicants = async (job: Job) => {
    try {
      const data = await api.getApplicants(job._id || job.id);
      setApplicants(data);
      setViewingApplicantsForJob(job);
    } catch (err) {
      alert("❌ Failed to load applicants");
    }
  };

  // ✅ Update Applicant Status
  const handleUpdateStatus = async (applicationId: string, status: string) => {
    try {
      await api.updateApplicantStatus(applicationId, status);
      alert(`✅ Status updated to ${status}`);
      // Refresh applicant list
      if (viewingApplicantsForJob) {
        const data = await api.getApplicants(viewingApplicantsForJob._id || viewingApplicantsForJob.id);
        setApplicants(data);
      }
    } catch {
      alert("❌ Failed to update status");
    }
  };

  // ✅ Filter jobs belonging to this employer
  const companyJobs = jobs.filter(
    (job) => job.companyId === employer.id || job.companyId === employer._id
  );

  if (!employer || !employer.name) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading employer profile...
      </div>
    );
  }

  return (
    <main className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Employer Profile Section */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-interactive relative">
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-secondary transition-colors"
          aria-label="Edit Profile"
        >
          <PencilIcon className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          <img
            src={employer.logo || "https://via.placeholder.com/150"}
            alt={employer.name}
            className="h-24 w-24 rounded-full mr-6 border-4 border-secondary object-cover"
          />
          <div>
            <h2 className="text-3xl font-bold text-neutral">{employer.name}</h2>
            <p className="text-gray-600">{employer.website}</p>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-interactive">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-neutral flex items-center">
            <BriefcaseIcon className="h-6 w-6 mr-2" />
            Your Job Postings
          </h3>
          <button
            onClick={() => setIsPostJobModalOpen(true)}
            className="flex items-center bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-md transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Post New Job
          </button>
        </div>

        <div className="space-y-4">
          {companyJobs.length > 0 ? (
            companyJobs.map((job) => (
              <div
                key={job._id || job.id}
                className="p-4 border rounded-lg hover:shadow-sm bg-white/50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg">{job.title}</h4>
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleViewApplicants(job)}
                      className="text-primary font-semibold hover:underline"
                    >
                      View Applicants ({job.applicants?.length || 0})
                    </button>

                    <button
                      onClick={() => handleDeleteJob(job._id || job.id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You haven’t posted any jobs yet.</p>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employer Profile"
      >
        <CompanyProfileEdit
          employer={employer}
          onSave={handleSaveProfile}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Post Job Modal */}
      <Modal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        title="Post a New Job"
      >
        <PostJobForm
          companyId={employer.id || employer._id}
          onSave={handleSaveJob}
          onCancel={() => setIsPostJobModalOpen(false)}
        />
      </Modal>

      {/* View Applicants Modal */}
      {/* {viewingApplicantsForJob && (
        <Modal
          isOpen={!!viewingApplicantsForJob}
          onClose={() => setViewingApplicantsForJob(null)}
          title={`Applicants for ${viewingApplicantsForJob.title}`}
        >
          <div className="space-y-4">
            {applicants.length > 0 ? (
              applicants.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <img
                      src={app.seekerId?.photoUrl || "https://via.placeholder.com/100"}
                      alt={app.seekerId?.name}
                      className="h-12 w-12 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-semibold">{app.seekerId?.name}</p>
                      <p className="text-sm text-gray-600">{app.seekerId?.email}</p>
                      <p className="text-xs text-gray-500">Status: {app.status}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStatus(app._id, "SHORTLISTED")}
                      className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                    >
                      ⭐ Shortlist
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app._id, "REJECTED")}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      ❌ Reject
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(app._id, "HIRED")}
                      className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      ✅ Hire
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No applicants yet for this position.</p>
            )}
          </div>
        </Modal>
      )} */}

        {viewingApplicantsForJob && (
  <Modal
    isOpen={!!viewingApplicantsForJob}
    onClose={() => setViewingApplicantsForJob(null)}
    title={`Applicants for ${viewingApplicantsForJob.title}`}
  >
    <div className="space-y-4">
      {applicants.length > 0 ? (
        applicants.map((app) => (
          <div
            key={app._id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <img
                src={app.seekerId?.photoUrl || "https://via.placeholder.com/100"}
                alt={app.seekerId?.name}
                className="h-12 w-12 rounded-full mr-4"
              />
              <div>
                <p className="font-semibold">{app.seekerId?.name}</p>
                <p className="text-sm text-gray-600">{app.seekerId?.email}</p>
                <p className="text-xs text-gray-500 mb-1">
                  Status: <strong>{app.status}</strong>
                </p>

                {/* ✅ View Resume link or fallback */}
                {app.seekerId?.resumeUrl ? (
                  <a
                    href={app.seekerId.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    📄 View Resume
                  </a>
                ) : (
                  <p className="text-sm text-gray-400 italic">Resume not submitted</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleUpdateStatus(app._id, "SHORTLISTED")}
                className="px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
              >
                 Shortlist
              </button>
              <button
                onClick={() => handleUpdateStatus(app._id, "REJECTED")}
                className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={() => handleUpdateStatus(app._id, "HIRED")}
                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
              >
                 Hire
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No applicants yet for this position.</p>
      )}
    </div>
  </Modal>
)}


    </main>
  );
};

export default CompanyDashboard;
