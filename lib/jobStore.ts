import { JobStatus } from '../types/analysis';

/**
 * In-memory store for analysis jobs.
 * 
 * Note: This is an in-memory Map which is sufficient for this assessment/prototype.
 * In a production environment with serverless functions (like Vercel), this state 
 * will be lost between cold starts. 
 * 
 * Production Upgrade Path:
 * Replace this Map with a persistent key-value store like Upstash Redis.
 * Example:
 * import { Redis } from '@upstash/redis'
 * const redis = Redis.fromEnv()
 * await redis.set(`job:${id}`, status)
 */
const jobStore = new Map<string, JobStatus>();

export function createJob(id: string): void {
  jobStore.set(id, { status: 'processing' });
}

export function updateJob(id: string, status: JobStatus): void {
  jobStore.set(id, status);
}

export function getJob(id: string): JobStatus | undefined {
  return jobStore.get(id);
}
