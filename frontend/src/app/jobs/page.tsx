"use client";

import { useEffect, useMemo, useState } from "react";

type JobType = "Full-Time" | "Part-Time" | "Contract";

type Job = {
  id: number;
  title: string;
  location: string;
  type: JobType;
  postedAt: string;
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<JobType>("Full-Time");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then(setJobs)
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const filteredJobs = useMemo(() => {
    const value = debouncedSearch.toLowerCase();

    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(value) ||
        job.location.toLowerCase().includes(value),
    );
  }, [jobs, debouncedSearch]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!title.trim()) errors.title = "Job title is required";
    else if (title.length < 3 || title.length > 80)
      errors.title = "Job title must be 3–80 characters";

    if (!location.trim()) errors.location = "Location is required";
    else if (location.length < 2 || location.length > 60)
      errors.location = "Location must be 2–60 characters";

    if (!type) errors.type = "Job type is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const res = await fetch("http://localhost:3000/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, location, type }),
    });

    if (!res.ok) {
      setError("Failed to create job");
      return;
    }

    const newJob = await res.json();

    setJobs((prev) => [newJob, ...prev]);
    setTitle("");
    setLocation("");
    setType("Full-Time");
    setFormErrors({});
  };

  if (loading) return <p style={{ padding: 24 }}>Loading jobs...</p>;
  if (error) return <p style={{ padding: 24 }}>{error}</p>;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f6f7fb",
        padding: "32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, marginBottom: 24 }}>Job Listings</h1>

        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 12,
            marginBottom: 24,
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: 16 }}>Add New Job</h2>

          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <input
                placeholder="Job Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
              {formErrors.title && <p style={errorStyle}>{formErrors.title}</p>}
            </div>

            <div>
              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={inputStyle}
              />
              {formErrors.location && (
                <p style={errorStyle}>{formErrors.location}</p>
              )}
            </div>

            <div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as JobType)}
                style={inputStyle}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "12px 16px",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Add Job
            </button>
          </div>
        </form>

        <input
          placeholder="Search by title or location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...inputStyle,
            marginBottom: 20,
            background: "#fff",
          }}
        />

        {filteredJobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                padding: 20,
                marginBottom: 16,
                borderRadius: 12,
                boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
              }}
            >
              <h2 style={{ marginBottom: 8 }}>{job.title}</h2>
              <p>{job.location}</p>
              <p>{job.type}</p>
              <p>{new Date(job.postedAt).toLocaleDateString()}</p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  border: "1px solid #d1d5db",
  borderRadius: 8,
  fontSize: 14,
};

const errorStyle: React.CSSProperties = {
  color: "#dc2626",
  fontSize: 13,
  marginTop: 4,
};