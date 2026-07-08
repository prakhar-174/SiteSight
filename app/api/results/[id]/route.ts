import { NextResponse } from 'next/server';
import { getJob } from '../../../../lib/jobStore';

/**
 * GET /api/results/[id]
 * Next.js App Router Route Handler.
 * Returns the current status of an analysis job by its ID.
 * 
 * Polling Pattern:
 * The frontend will call this endpoint repeatedly (e.g. every 2 seconds) after receiving
 * a jobId from the POST /api/analyze endpoint. 
 * If status is 'processing', the UI shows a loading state.
 * If status is 'complete', the UI renders the full report.
 * If status is 'error', the UI shows the error message.
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'Job ID is required.' }, { status: 400 });
  }

  const job = getJob(id);

  if (!job) {
    return NextResponse.json({ error: 'Job not found or has expired.' }, { status: 404 });
  }

  return NextResponse.json(job, { status: 200 });
}
