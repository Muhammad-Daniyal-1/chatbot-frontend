"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Store the token and user data
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirect to chat page
      router.push("/ai_agent/chat");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-4 mb-8">
          <Image
            src="/ai_agent_logo.png"
            alt="logo"
            className="rounded-full"
            width={100}
            height={100}
          />
          <h1 className="text-[var(--foreground)] text-2xl font-medium">
            Create Account
          </h1>
          <p className="text-[var(--foreground)] text-sm opacity-70">
            Sign up to get started with AI Agent
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[var(--foreground)] mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[var(--background)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] placeholder-[#9597a6] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border-1 border-primary focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[var(--foreground)] mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--background)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] placeholder-[#9597a6] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border-1 border-primary focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Enter your email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[var(--foreground)] mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[var(--background)] rounded-xl py-3 px-4 text-sm text-[var(--foreground)] placeholder-[#9597a6] shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] border-1 border-primary focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Enter your password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#6b8afc] to-[var(--primary)] text-white py-3 px-4 rounded-xl font-medium shadow-[0_4px_10px_-2px_rgba(196,107,249,0.3)] hover:shadow-[0_4px_20px_-5px_rgba(196,107,249,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-[var(--foreground)]">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--primary)] hover:text-[#6b8afc] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
