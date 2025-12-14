import React, { useState, ChangeEvent } from "react";
import { JobSeeker } from "../types";

interface JobSeekerProfileEditProps {
  seeker: JobSeeker;
  onSave: (updatedSeeker: JobSeeker) => void;
  onCancel: () => void;
}

const JobSeekerProfileEdit: React.FC<JobSeekerProfileEditProps> = ({
  seeker,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<JobSeeker>(seeker);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    seeker.photoUrl || null
  );
  const [resumeUrl, setResumeUrl] = useState<string>(seeker.resumeUrl || "");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setFormData((prev) => ({
        ...prev,
        photoUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSkillsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => ({ ...prev, skills }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      resumeUrl, // ✅ ensure resumeUrl is included
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Photo */}
      <div className="flex items-center space-x-6">
        <img
          src={photoPreview || "https://via.placeholder.com/100"}
          alt="Profile"
          className="h-24 w-24 rounded-full object-cover border-4 border-primary"
        />
        <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
          Change Photo
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={handlePhotoChange}
          />
        </label>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Expected Salary
          </label>
          <input
            type="number"
            name="expectedSalary"
            value={formData.expectedSalary || ""}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            value={(formData.skills || []).join(", ")}
            onChange={handleSkillsChange}
            className="mt-1 block w-full border rounded-md px-3 py-2"
          />
        </div>
      </div>

      {/* Resume URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Resume (Google Drive link)
        </label>
        <input
          type="url"
          placeholder="https://drive.google.com/file/d/XXXX/view"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
          className="mt-1 block w-full border rounded-md px-3 py-2"
        />
        <p className="mt-1 text-xs text-gray-500">
          Set access to <b>Anyone with the link → Viewer</b>
        </p>

        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm text-primary hover:underline"
          >
            Preview Resume
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="border px-4 py-2 rounded-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default JobSeekerProfileEdit;



