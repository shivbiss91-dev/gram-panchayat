import prisma from '../database';

/**
 * Generates a unique, server-side sequential complaint ID in the format GP-YYYY-XXXX
 * Example: GP-2026-0001
 */
export async function generateComplaintNumber(): Promise<string> {
  const currentYear = new Date().getFullYear();
  const yearPrefix = `GP-${currentYear}-`;

  // Find the latest complaint registered for this year
  const latestComplaint = await prisma.complaint.findFirst({
    where: {
      complaintNumber: {
        startsWith: yearPrefix,
      },
    },
    orderBy: {
      complaintNumber: 'desc',
    },
    select: {
      complaintNumber: true,
    },
  });

  let nextSequence = 1;
  if (latestComplaint && latestComplaint.complaintNumber) {
    const parts = latestComplaint.complaintNumber.split('-');
    if (parts.length === 3) {
      const parsed = parseInt(parts[2], 10);
      if (!isNaN(parsed)) {
        nextSequence = parsed + 1;
      }
    }
  }

  // Format with 4 digits zero padding
  const paddedSeq = String(nextSequence).padStart(4, '0');
  const complaintNumber = `${yearPrefix}${paddedSeq}`;

  // Ensure uniqueness in case of race condition
  const existing = await prisma.complaint.findUnique({
    where: { complaintNumber },
  });

  if (existing) {
    // Increment until free
    let seq = nextSequence + 1;
    while (true) {
      const candidate = `${yearPrefix}${String(seq).padStart(4, '0')}`;
      const conflict = await prisma.complaint.findUnique({
        where: { complaintNumber: candidate },
      });
      if (!conflict) {
        return candidate;
      }
      seq++;
    }
  }

  return complaintNumber;
}
