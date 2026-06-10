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
    <main style={{ padding: 24 }}>
      <h1>Job Listings</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <h2>Add New Job</h2>

        <div>
          <input
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {formErrors.title && <p>{formErrors.title}</p>}
        </div>

        <div>
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          {formErrors.location && <p>{formErrors.location}</p>}
        </div>

        <div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as JobType)}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
          {formErrors.type && <p>{formErrors.type}</p>}
        </div>

        <button type="submit">Add Job</button>
      </form>

      <input
        placeholder="Search by title or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, width: "100%", padding: 8 }}
      />

      {filteredJobs.length === 0 ? (
        <p>No jobs found</p>
      ) : (
        filteredJobs.map((job) => (
          <div
            key={job.id}
            style={{
              border: "1px solid #ddd",
              padding: 16,
              marginBottom: 12,
              borderRadius: 8,
            }}
          >
            <h2>{job.title}</h2>
            <p>{job.location}</p>
            <p>{job.type}</p>
            <p>{new Date(job.postedAt).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </main>
  );
}
