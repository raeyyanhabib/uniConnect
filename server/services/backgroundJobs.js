import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const startBackgroundJobs = () => {
  if (process.env.NODE_ENV === 'test') {
    return () => {};
  }
  console.log('[Background Jobs] Starting UniConnect periodic background maintenance task runner...');

  // Run every 2 minutes
  const INTERVAL_MS = 2 * 60 * 1000;

  const runTask = async () => {
    try {
      const activeGroups = await prisma.studyGroup.count();
      const activeResources = await prisma.resource.count();
      console.log(`[Background Job Tick] System Status: ${activeGroups} active study groups, ${activeResources} resources available.`);
    } catch (err) {
      console.error('[Background Job Error]', err.message);
    }
  };

  // Run initial tick and schedule interval
  runTask();
  const timer = setInterval(runTask, INTERVAL_MS);

  return () => clearInterval(timer);
};
