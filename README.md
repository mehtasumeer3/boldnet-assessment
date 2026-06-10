# boldnet-assessment
# Job Listings Application

## Overview

This project is a full-stack Job Listings application built using Next.js, NestJS, and TypeScript.

Features implemented:

* View all job listings
* Add a new job
* Form validation
* Loading and error states
* Search jobs by title or location
* Debounced search (300ms)
* Dynamic UI updates without page refresh

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React
* TypeScript

### Backend

* NestJS
* TypeScript
* class-validator

### Database

* In-memory array (seeded with sample data)

---

## Installation

### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend runs on:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:3001
```

---

## Environment Variables

Frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Available Features

### Job Listing

* Fetches jobs from GET /jobs
* Displays loading state while fetching
* Displays error message on failure

### Add Job

* Job Title validation (3–80 characters)
* Location validation (2–60 characters)
* Job Type validation
* Inline validation errors
* Form resets after successful submission

### Search

* Search by title
* Search by location
* Case-insensitive filtering
* 300ms debounce
* "No jobs found" message

---

## Assumptions

* Data is stored in memory for simplicity.
* Jobs are not persisted after server restart.
* Client-side filtering is used for search.
