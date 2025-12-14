import axiosInstance from "./axiosInstance";
import {
  JobSeeker,
  Employer,
  Admin,
  Job,
  Review,
  BlogPost,
  ReactionType,
  Comment,
} from "../types";
/* ================= GEMINI ================= */
export const boostResume=async(text: string) => {
  const res = await axiosInstance.post("/ai/boost", { text });
  return res.data.boostedText;
};


/* ================= AUTH ================= */

export const authenticateUser = async (
  email: string,
  password: string,
  role: string
) => {
  console.log("Authenticating user with role:", email, role);
  const res = await axiosInstance.post("/auth/login", {
    email,
    password,
    role,
  });
  if (res.data?.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res.data;
};

export const logout = async () => {
  localStorage.removeItem("token");
  return Promise.resolve();
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: string
) => {
  const res = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
    role: role.toUpperCase(),
  });
  return res.data;
};

export const getUserProfile = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};

/* ================= JOBS ================= */

export const getJobs = async () => {
  const res = await axiosInstance.get("/job");
  return res.data;
};

/* ================= SEEKER ================= */

export const getSeekers = async () => {
  const res = await axiosInstance.get("/admin/seekers");
  return res.data;
};

export const saveSeeker = async (seeker: any) => {
  const res = await axiosInstance.put("/auth/me", {
    ...seeker,
    resumeUrl: seeker.resumeUrl, // Google Drive link
  });

  return res.data.user;
};



export const applyJob = async (jobId: string) => {
  const res = await axiosInstance.post(`/applications/${jobId}/apply`);
  return res.data;
};

export const getMyApplications = async () => {
  const res = await axiosInstance.get("/applications/me");
  return res.data;
};

export const addReview = async (companyId: string, review: any) => {
  const res = await axiosInstance.post(
    `/companies/${companyId}/reviews`,
    review
  );
  return res.data;
};

/* ================= COMPANY ================= */

export const getCompanies = async () => {
  const res = await axiosInstance.get("/auth/companies");
  return res.data;
};

export const createJob = async (jobData: any) => {
  const res = await axiosInstance.post("/job", jobData);
  return res.data;
};

export const deleteJob = async (jobId: string) => {
  const res = await axiosInstance.delete(`/job/${jobId}`);
  return res.data;
};

export const saveCompany = async (employer: any) => {
  const res = await axiosInstance.put("/auth/me", employer);
  return res.data.user;
};

export const getMyJobs = async () => {
  const res = await axiosInstance.get("/job/my/jobs");
  return res.data;
};

export const getApplicants = async (jobId: string) => {
  const res = await axiosInstance.get(`/applications/${jobId}/applications`);
  return res.data;
};

export const updateApplicantStatus = async (
  applicationId: string,
  status: string
) => {
  const res = await axiosInstance.put(`/applications/status/${applicationId}`, {
    status,
  });
  return res.data;
};

/* ================= ADMIN ================= */

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const getAllJobs = async () => {
  const res = await axiosInstance.get("/admin/jobs");
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await axiosInstance.delete(`/admin/users/${id}`);
  return res.data;
};

export const adminDeleteJob = async (jobId: string) => {
  const res = await axiosInstance.delete(`/admin/jobs/${jobId}`);
  return res.data;
};

export const deleteEntity = async (type: string, id: string) => {
  if (type === "job") return adminDeleteJob(id);
  if (type === "seeker" || type === "employer") return deleteUser(id);
  return Promise.resolve();
};

/* ================= BLOG (REAL API) ================= */

/* ================= BLOG ================= */

export const getBlogPosts = async () => {
  const res = await axiosInstance.get("/blogs");
  return Array.isArray(res.data) ? res.data : [];
};

export const addBlogPost = async (content: string) => {
  const res = await axiosInstance.post("/blogs", { content });
  return res.data;
};


export const updateBlogPost = async (postId: string, content: string) => {
  const res = await axiosInstance.put(`/blogs/${postId}`, { content });
  return res.data;
};

export const deleteBlogPost = async (postId: string) => {
  const res = await axiosInstance.delete(`/blogs/${postId}`);
  return res.data;
};

export const addOrUpdateReaction = async (
  postId: string,
  type: "like" | "love" | "dislike"
) => {
  const res = await axiosInstance.post(
    `/blogs/${postId}/reaction`,
    { type }
  );
  return res.data;
};

export const addComment = async (postId: string, content: string) => {
  const res = await axiosInstance.post(`/blogs/${postId}/comments`, { content });
  return res.data; // comments array
};


export const updateComment = async (
  postId: string,
  commentId: string,
  content: string
) => {
  const res = await axiosInstance.put(
    `/blogs/${postId}/comments/${commentId}`,
    { content }
  );
  return res.data;
};

export const deleteComment = async (postId: string, commentId: string) => {
  const res = await axiosInstance.delete(
    `/blogs/${postId}/comments/${commentId}`
  );
  return res.data;
};
export const normalizeBlog = (blog: any): BlogPost => ({
  id: blog._id,
  authorId: blog.authorId,
  authorName: blog.authorName,
  authorRole: blog.authorRole,
  authorPhotoUrl: blog.authorPhotoUrl,
  content: blog.content,
  timestamp: blog.createdAt,
  reactions: blog.reactions.map((r: any) => ({
    userId: r.userId,
    type: r.type,
  })),
  comments: blog.comments.map((c: any) => ({
    id: c._id,
    authorId: c.authorId,
    authorName: c.authorName,
    authorPhotoUrl: c.authorPhotoUrl,
    content: c.content,
    timestamp: c.createdAt,
  })),
});
