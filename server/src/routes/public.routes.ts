import { Router, Request, Response } from 'express';
import prisma from '../database';

const router = Router();

// GET /api/public/stats - Real portal statistics for landing page
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [total, resolved, inProgress, pending, underReview, assigned] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'RESOLVED' } }),
      prisma.complaint.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.complaint.count({ where: { status: 'SUBMITTED' } }),
      prisma.complaint.count({ where: { status: 'UNDER_REVIEW' } }),
      prisma.complaint.count({ where: { status: 'ASSIGNED' } }),
    ]);

    res.json({
      success: true,
      data: {
        totalComplaints: total,
        resolvedComplaints: resolved,
        inProgressComplaints: inProgress,
        pendingComplaints: pending + underReview,
        assignedComplaints: assigned,
        resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      },
    });
  } catch (error) {
    console.error('Public stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch portal statistics.',
    });
  }
});

// GET /api/public/track/:complaintNumber - Public tracking without exposing citizen PII
router.get('/track/:complaintNumber', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawNumber = req.params.complaintNumber?.trim().toUpperCase();
    if (!rawNumber) {
      res.status(400).json({ success: false, message: 'Please provide a complaint ID.' });
      return;
    }

    const complaint = await prisma.complaint.findUnique({
      where: { complaintNumber: rawNumber },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            status: true,
            remarks: true,
            changedBy: true,
            createdAt: true,
          },
        },
        feedback: {
          select: {
            rating: true,
            comment: true,
            createdAt: true,
          },
        },
      },
    });

    if (!complaint) {
      res.status(404).json({
        success: false,
        message: `Complaint with ID "${rawNumber}" was not found. Please verify the ID and try again.`,
      });
      return;
    }

    // Return safe data without exposing citizen email, phone, or exact user details
    res.json({
      success: true,
      data: {
        id: complaint.id,
        complaintNumber: complaint.complaintNumber,
        category: complaint.category,
        title: complaint.title,
        description: complaint.description,
        location: complaint.location,
        imageUrl: complaint.imageUrl,
        status: complaint.status,
        assignedDepartment: complaint.assignedDepartment,
        submittedAt: complaint.submittedAt,
        resolvedAt: complaint.resolvedAt,
        statusHistory: complaint.statusHistory,
        feedback: complaint.feedback,
      },
    });
  } catch (error) {
    console.error('Public tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to track complaint at this time. Please try again.',
    });
  }
});

export default router;
