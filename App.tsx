import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import SeekerDashboard from "./components/SeekerDashboard";
import CompanyDashboard from "./components/CompanyDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SignupPage from "./components/SignupPage";
import {
  JobSeeker,
  Employer,
  Admin,
  Job,
  Review,
  BlogPost,
  ReactionType,
  Comment,
} from "./types";
import * as api from "./services/apiService";
import { normalizeBlog } from "./services/apiService";

import BlogPage from "./components/BlogPage";
import { BriefcaseIcon, NewspaperIcon } from "./components/icons";

type User = JobSeeker | Employer | Admin;
type UserRole = "SEEKER" | "EMPLOYER" | "ADMIN";
type ActiveView = "dashboard" | "blog";

const Notification = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-secondary text-white py-3 px-5 rounded-lg shadow-lg z-50 animate-fade-in-down flex items-center space-x-3">
      <span className="font-bold">Success!</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-white/80 hover:text-white font-bold text-2xl leading-none"
      >
        &times;
      </button>
      <style>{`
            @keyframes fade-in-down {
              0% { opacity: 0; transform: translateY(-20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-down { animation: fade-in-down 0.5s ease-out forwards; }
          `}</style>
    </div>
  );
};

const App: React.FC = () => {
  // Data State
  const [seekers, setSeekers] = useState<JobSeeker[]>([]);
  const [companies, setCompanies] = useState<Employer[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // UI State
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [notification, setNotification] = useState<string | null>(null);
  const [showSignup, setShowSignup] = useState(false);

  // Initial data load
  // ✅ Restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const restoreUser = async () => {
      try {
        const profile = await api.getUserProfile();
        if (profile?.user) {
          setCurrentUser(profile.user);
          setCurrentUserRole(profile.user.role);
        }
      } catch {
        localStorage.removeItem("token");
      }
    };

    restoreUser();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      // 🧹 Reset all data on logout
      setSeekers([]);
      setCompanies([]);
      setJobs([]);
      setBlogPosts([]);
      return;
    }

    const loadData = async () => {
      setIsLoading(true);

      try {
        const role = currentUserRole;
        const promises: Promise<any>[] = [];
        const handlers: Record<string, (data: any) => void> = {};

        // 🌐 Shared for all roles
        promises.push(api.getBlogPosts());
        handlers.blog = setBlogPosts;

        // 💼 Everyone can see jobs (default)
        promises.push(api.getJobs());
        handlers.jobs = setJobs;

        // 👑 Admin-only data
        if (role === "ADMIN") {
          promises.push(api.getSeekers());
          promises.push(api.getCompanies());
          handlers.seekers = setSeekers;
          handlers.companies = setCompanies;
        }

        // 🏢 Employer — load only their own jobs
        if (role === "EMPLOYER") {
          promises[1] = api.getMyJobs ? api.getMyJobs() : api.getJobs();
        }

        // 👷 Seeker — needs company info to view job listings
        if (role === "SEEKER") {
          promises.push(api.getCompanies());
          handlers.companies = setCompanies;
        }

        // 🔄 Run everything in parallel
        const results = await Promise.all(promises);

        // 🧩 Apply results in order
        let i = 0;
        if (handlers.blog) handlers.blog(results[i++]); // blogs
        if (handlers.jobs) handlers.jobs(results[i++]); // jobs

        if (role === "ADMIN") {
          if (handlers.seekers) handlers.seekers(results[i++]);
          if (handlers.companies) handlers.companies(results[i++]);
        }

        if (role === "SEEKER" && handlers.companies) {
          handlers.companies(results[i++]);
        }
      } catch (err) {
        console.error("⚠️ Failed to load dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser, currentUserRole]);

  const handleLogin = async (
    email: string,
    password: string,
    role: UserRole
  ) => {
    setAuthError(null);
    setIsLoading(true);
    try {
      // Step 1: Authenticate and store token

      await api.authenticateUser(email, password, role);

      // Step 2: Get user profile from backend
      const userProfile = await api.getUserProfile();
      console.log(userProfile, userProfile.user, userProfile.user.role);

      if (userProfile && userProfile.user) {
        setCurrentUser(userProfile.user);
        setCurrentUserRole(userProfile.user.role); // role from backend
      } else {
        throw new Error("Invalid credentials or role.");
      }
    } catch (error: any) {
      setAuthError(error.response?.data?.msg || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.logout(); // clears token in service

    // ✅ Clear in React state
    setCurrentUser(null);
    setCurrentUserRole(null);

    // ✅ Clear token (safety)
    localStorage.removeItem("token");

    // ✅ Force redirect to login (minimal change)
    window.location.href = "/";
  };

  const handleRegister = async (name, email, password, role) => {
    try {
      await api.registerUser(name, email, password, role);
      alert("Account created! Please login.");
      window.location.href = "/";
    } catch (err: any) {
      setAuthError(err.response?.data?.msg || "Signup failed");
    }
  };

  const handleJobApplied = (jobId: string, seekerId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId
          ? {
              ...job,
              applicants: [...(job.applicants || []), seekerId],
            }
          : job
      )
    );
  };

  const handleSaveSeekerProfile = async (updatedSeeker: JobSeeker) => {
    try {
      const savedSeeker = await api.saveSeeker(updatedSeeker);

      // ✅ Update current user immediately
      setCurrentUser((prev) => ({ ...prev, ...savedSeeker }));

      // ✅ Update seekers list if applicable
      setSeekers((prev) =>
        prev.map((s) =>
          s.id === savedSeeker._id || s.id === savedSeeker.id ? savedSeeker : s
        )
      );

      alert("✅ Profile updated successfully!");
    } catch (err: any) {
      console.error("❌ Failed to update seeker profile:", err);
      alert(err?.response?.data?.msg || "Failed to update profile");
    }
  };
  const handleSaveCompanyProfile = async (updatedCompany: Employer) => {
    try {
      const savedCompany = await api.saveCompany(updatedCompany);

      // ✅ Update current user immediately
      setCurrentUser((prev) => ({ ...prev, ...savedCompany }));

      // ✅ Update companies list if applicable
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === savedCompany._id || c.id === savedCompany.id
            ? savedCompany
            : c
        )
      );

      alert("✅ Profile updated successfully!");
    } catch (err: any) {
      console.error("❌ Failed to update company profile:", err);
      alert(err?.response?.data?.msg || "Failed to update profile");
    }
  };

  const handleAddReview = async (
    companyId: string,
    review: Omit<Review, "id" | "date">
  ) => {
    const updatedCompany = await api.addReview(companyId, review);
    setCompanies(
      companies.map((c) => (c.id === companyId ? updatedCompany : c))
    );

    // Automatically create a blog post from the review
    if (currentUser && currentUserRole === "SEEKER") {
      const seeker = currentUser as JobSeeker;
      const employer = companies.find((c) => c.id === companyId);
      if (employer) {
        const content = `New review for ${
          employer.name
        }!\n\nI gave them a ${"★".repeat(review.rating)}${"☆".repeat(
          5 - review.rating
        )} rating.\n\nMy thoughts: "${review.comment}"`;

        const newPostData: Omit<
          BlogPost,
          "id" | "timestamp" | "reactions" | "comments"
        > = {
          authorId: seeker.id,
          authorName: seeker.name,
          authorRole: "SEEKER",
          authorPhotoUrl: seeker.photoUrl,
          content,
        };
        const savedPost = await api.addBlogPost(newPostData);
        setBlogPosts((prev) => [savedPost, ...prev]);

        // Show notification
        setNotification(
          `Your review for ${employer.name} is now live on the blog!`
        );
      }
    }
  };

  const handleCompanySaveJob = (newJob: Job) => {
    // Just update the jobs state with the new job
    setJobs((prev) => [newJob, ...prev]);

    // Optional: show notification
    setNotification("✅ Job posted successfully!");
  };

  const handleAdminDelete = async (
    type: "job" | "employer" | "seeker" | "blogPost",
    id: string
  ) => {
    if (await api.deleteEntity(type, id)) {
      if (type === "job") setJobs(jobs.filter((j) => j.id !== id));
      if (type === "seeker") setSeekers(seekers.filter((s) => s.id !== id));
      if (type === "employer") {
        setCompanies(companies.filter((c) => c.id !== id));
        // Also remove jobs associated with that employer
        setJobs(jobs.filter((j) => j.companyId !== id));
      }
      if (type === "blogPost")
        setBlogPosts(blogPosts.filter((p) => p.id !== id));
    }
  };

  const handleAdminSaveSeeker = async (seeker: JobSeeker) => {
    const savedSeeker = await api.saveSeeker(seeker);
    if (seekers.some((s) => s.id === savedSeeker.id)) {
      setSeekers(
        seekers.map((s) => (s.id === savedSeeker.id ? savedSeeker : s))
      );
    } else {
      setSeekers([...seekers, savedSeeker]);
    }
  };

  const handleAdminSaveCompany = async (employer: Employer) => {
    const savedCompany = await api.saveCompany(employer);
    if (companies.some((c) => c.id === savedCompany.id)) {
      setCompanies(
        companies.map((c) => (c.id === savedCompany.id ? savedCompany : c))
      );
    } else {
      setCompanies([...companies, savedCompany]);
    }
  };

  const handleAdminSaveJob = async (
    job: Job | Omit<Job, "id" | "applicants" | "shortlisted" | "rejected">
  ) => {
    const savedJob = await api.saveJob(job);
    if (jobs.some((j) => j.id === savedJob.id)) {
      setJobs(jobs.map((j) => (j.id === savedJob.id ? savedJob : j)));
    } else {
      setJobs([savedJob, ...jobs]);
    }
  };

  const handleAddBlogPost = async (content: string) => {
    const savedPost = await api.addBlogPost(content);
    setBlogPosts((prev) => [normalizeBlog(savedPost), ...prev]);
  };

  const handleUpdateBlogPost = async (postId: string, content: string) => {
    const updatedPost = await api.updateBlogPost(postId, content);
    setBlogPosts((posts) =>
      posts.map((p) => (p.id === postId ? updatedPost : p))
    );
  };

  const handleDeleteBlogPost = async (postId: string) => {
    if (await api.deleteEntity("blogPost", postId)) {
      setBlogPosts((posts) => posts.filter((p) => p.id !== postId));
    }
  };

  const handlePostReaction = async (
    postId: string,
    reactionType: ReactionType
  ) => {
    const reactions = await api.addOrUpdateReaction(postId, reactionType);

    setBlogPosts((posts) =>
      posts.map((p) => (p.id === postId ? { ...p, reactions } : p))
    );
  };

  const handleAddComment = async (postId: string, content: string) => {
    const comments = await api.addComment(postId, content);

    setBlogPosts((posts) =>
      posts.map((p) => (p.id === postId ? { ...p, comments } : p))
    );
  };

  const handleUpdateComment = async (
  postId: string,
  commentId: string,
  content: string
) => {
  const res = await api.updateComment(postId, commentId, content);
  const updatedComment = res.comment;

  setBlogPosts((posts) =>
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.map((c) =>
              c.id === commentId ? { ...c, ...updatedComment } : c
            ),
          }
        : post
    )
  );
};


  const handleDeleteComment = async (
  postId: string,
  commentId: string
) => {
  await api.deleteComment(postId, commentId);

  setBlogPosts((posts) =>
    posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            comments: post.comments.filter((c) => c.id !== commentId),
          }
        : post
    )
  );
};


  if (isLoading && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-primary">
        Loading Job Executive...
      </div>
    );
  }

  if (!currentUser || !currentUserRole) {
    return showSignup ? (
      <SignupPage
        onRegister={handleRegister}
        error={authError}
        onSwitchToLogin={() => setShowSignup(false)}
      />
    ) : (
      <LoginPage
        onLogin={handleLogin}
        error={authError}
        onSwitchToSignup={() => setShowSignup(true)}
      />
    );
  }

  const renderDashboard = () => {
    switch (currentUserRole) {
      case "SEEKER":
        return (
          <SeekerDashboard
            seeker={currentUser as JobSeeker}
            jobs={jobs}
            companies={companies}
            onAddReview={handleAddReview}
            onSaveProfile={handleSaveSeekerProfile}
            onJobApplied={handleJobApplied}
          />
        );
      case "EMPLOYER":
        return (
          <CompanyDashboard
            employer={currentUser as Employer}
            jobs={jobs}
            seekers={seekers}
            onSaveProfile={handleSaveCompanyProfile}
            onSaveJob={handleCompanySaveJob}
            onDeleteJob={async (jobId) => {
              await api.deleteJob(jobId);
              setJobs((prev) => prev.filter((j) => j.id !== jobId));
            }}
          />
        );
      case "ADMIN":
        return (
          <AdminDashboard
            jobs={jobs}
            employers={companies}
            seekers={seekers}
            onDelete={handleAdminDelete}
            onSaveSeeker={handleAdminSaveSeeker}
            onSaveCompany={handleAdminSaveCompany}
            onSaveJob={handleAdminSaveJob}
          />
        );
      default:
        return <LoginPage onLogin={handleLogin} error={authError} />;
    }
  };

  let currentUserName = "ADMIN";
  let currentUserPhoto = `https://i.pravatar.cc/150?u=admin`;
  if (currentUserRole === "SEEKER") {
    currentUserName = (currentUser as JobSeeker).name;
    currentUserPhoto = (currentUser as JobSeeker).photoUrl;
  } else if (currentUserRole === "EMPLOYER") {
    currentUserName = (currentUser as Employer).name;
    currentUserPhoto = (currentUser as Employer).logo;
  }

  return (
    <div className="min-h-screen">
      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification(null)}
        />
      )}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Job Executive</h1>
            </div>
            <div className="hidden sm:block">
              <div className="flex space-x-4">
                {/* <NavButton
                  isActive={activeView === "dashboard"}
                  onClick={() => setActiveView("dashboard")}
                  icon={<BriefcaseIcon className="h-5 w-5 mr-2" />}
                >
                  Dashboard
                </NavButton> */}
                {/* <NavButton
                  isActive={activeView === "blog"}
                  onClick={() => setActiveView("blog")}
                  icon={<NewspaperIcon className="h-5 w-5 mr-2" />}
                >
                  Community Blog
                </NavButton> */}
              </div>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="font-semibold text-neutral hover:text-primary transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* <div className="sm:hidden p-2 bg-white/80 backdrop-blur-sm shadow-md">
        <div className="flex justify-around">
          <NavButton
            isActive={activeView === "dashboard"}
            onClick={() => setActiveView("dashboard")}
            icon={<BriefcaseIcon className="h-5 w-5" />}
          >
            <span className="sr-only">Dashboard</span>
          </NavButton>
          <NavButton
            isActive={activeView === "blog"}
            onClick={() => setActiveView("blog")}
            icon={<NewspaperIcon className="h-5 w-5" />}
          >
            <span className="sr-only">Blog</span>
          </NavButton>
        </div>
      </div> */}

      {activeView === "dashboard" ? (
        renderDashboard()
      ) : (
        <BlogPage
          posts={blogPosts}
          onAddPost={handleAddBlogPost}
          onUpdatePost={handleUpdateBlogPost}
          onDeletePost={handleDeleteBlogPost}
          onPostReaction={handlePostReaction}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          currentUserId={currentUser.id}
          currentUserRole={currentUserRole}
          currentUserName={currentUserName}
          currentUserPhoto={currentUserPhoto}
        />
      )}
    </div>
  );
};

const NavButton = ({
  isActive,
  onClick,
  children,
  icon,
}: {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`}
    aria-current={isActive ? "page" : undefined}
  >
    {icon}
    {children}
  </button>
);

export default App;
