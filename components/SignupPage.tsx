import React, { useState } from "react";

type UserRole = "SEEKER" | "EMPLOYER";

interface SignupPageProps {
  onRegister: (name: string, email: string, password: string, role: UserRole) => void;
  error: string | null;
  onSwitchToLogin: () => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onRegister, error, onSwitchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("SEEKER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onRegister(name, email, password, role);
    setTimeout(() => setIsSubmitting(false), 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white/80 p-10 rounded-2xl shadow-interactive-lg border border-white/50">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Create Your Account
        </h2>

        <p className="text-center text-sm text-gray-600 mb-6">
          Join Job Executive today!
        </p>

        {error && <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}

        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-3 py-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full px-3 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={role === "SEEKER"}
                onChange={() => setRole("SEEKER")}
              />
              Job Seeker
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={role === "EMPLOYER"}
                onChange={() => setRole("EMPLOYER")}
              />
              Employer
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-focus"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mt-4">
          Already have an account?
          <button onClick={onSwitchToLogin} className="text-primary font-semibold ml-1 hover:underline">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
