import { Body, Controller, Get, Post, BadRequestException } from '@nestjs/common';

type JobType = 'Full-Time' | 'Part-Time' | 'Contract';

interface Job {
  id: number;
  title: string;
  location: string;
  type: JobType;
  postedAt: string;
}

@Controller()
export class AppController {
  private jobs: Job[] = [
    {
      id: 1,
      title: 'Frontend Developer',
      location: 'Bangalore',
      type: 'Full-Time',
      postedAt: new Date().toISOString(),
    },
    {
      id: 2,
      title: 'Backend Developer',
      location: 'Pune',
      type: 'Full-Time',
      postedAt: new Date().toISOString(),
    },
    {
      id: 3,
      title: 'UI Developer',
      location: 'Mumbai',
      type: 'Contract',
      postedAt: new Date().toISOString(),
    },
    {
      id: 4,
      title: 'React Developer',
      location: 'Hyderabad',
      type: 'Part-Time',
      postedAt: new Date().toISOString(),
    },
    {
      id: 5,
      title: 'NestJS Developer',
      location: 'Chennai',
      type: 'Contract',
      postedAt: new Date().toISOString(),
    },
  ];

  @Get('jobs')
  getJobs() {
    return this.jobs;
  }

  @Post('jobs')
  createJob(
    @Body()
    body: {
      title: string;
      location: string;
      type: JobType;
    },
  ) {
    if (!body.title || body.title.length < 3 || body.title.length > 80) {
      throw new BadRequestException(
        'Job Title must be between 3 and 80 characters',
      );
    }

    if (
      !body.location ||
      body.location.length < 2 ||
      body.location.length > 60
    ) {
      throw new BadRequestException(
        'Location must be between 2 and 60 characters',
      );
    }

    if (
      !['Full-Time', 'Part-Time', 'Contract'].includes(body.type)
    ) {
      throw new BadRequestException('Invalid Job Type');
    }

    const newJob: Job = {
      id: this.jobs.length + 1,
      title: body.title,
      location: body.location,
      type: body.type,
      postedAt: new Date().toISOString(),
    };

    this.jobs.unshift(newJob);

    return newJob;
  }
}