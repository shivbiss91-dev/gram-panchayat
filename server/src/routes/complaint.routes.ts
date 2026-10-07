import { Router, Response } from 'express';
import prisma from '../database';
import { authenticate } from '../middleware/auth';
import { uploadComplaintImage } from '../middleware/upload';
import { generateComplaintNumber } from '../utils/complaintId';
import { AuthenticatedRequest } from '../types';
import { complaintCreateSchema, feedbackSchema } from '../validators/schemas';

const router = Router();

// All complaint endpoints require authentication
router.use(authenticate);

// GET /api/complaints - Get citizen's complaints with search, filter, and pagination
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const {
      search,
      status,
      category,
      page = '1',
      limit = '10',
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const take = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * take;

    const where: any = {
      userId: req.user.id,
    };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (category && category !== 'ALL') {
      where.category = category;
    }

    if (search && search.trim() !== '') {
      const q = search.trim();
      where.OR = [
        { complaintNumber: { contains: q } },
        { title: { contains: q } },
        { description: { contains: q } },
        { location: { contains: q } },
        { category: { contains: q } },
      ];
    }

    const [total, complaints] = await Promise.all([
      prisma.complaint.count({ where }),
      prisma.complaint.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip,
        take,
        include: {
          feedback: {
            select: { rating: true, comment: true },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: complaints,
      pagination: {
        total,
        page: pageNum,
        limit: take,
        totalPages: Math.ceil(total / take) || 1,
      },
    });
  } catch (error) {
    console.error('Fetch complaints error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve complaints.' });
  }
});

// POST /api/complaints - Create new complaint
router.post(
  '/',
  uploadComplaintImage.single('image'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const parsed = complaintCreateSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          message: parsed.error.errors[0]?.message || 'Invalid complaint details',
        });
        return;
      }

      const { category, title, description, location, latitude, longitude } = parsed.data;

      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const complaintNumber = await generateComplaintNumber();

      const complaint = await prisma.$transaction(async (tx) => {
        const created = await tx.complaint.create({
          data: {
            complaintNumber,
            userId: req.user!.id,
            category,
            title,
            description,
            location,
            latitude: latitude !== undefined ? latitude : null,
            longitude: longitude !== undefined ? longitude : null,
            imageUrl,
            status: 'SUBMITTED',
          },
        });

        // Add initial status history
        await tx.complaintStatusHistory.create({
          data: {
            complaintId: created.id,
            status: 'SUBMITTED',
            remarks: 'Complaint registered by citizen on the portal.',
            changedBy: req.user!.name,
          },
        });

        // Add citizen in-app notification
        await tx.notification.create({
          data: {
            userId: req.user!.id,
            complaintId: created.id,
            title: 'Complaint Registered',
            message: `Your complaint ${complaintNumber} regarding "${title}" has been successfully recorded.`,
          },
        });

        return created;
      });

      res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully.',
        data: complaint,
      });
    } catch (error) {
      console.error('Submit complaint error:', error);
      res.status(500).json({
        success: false,
        message: 'Complaint could not be submitted. Please check your inputs and try again.',
      });
    }
  }
);

// GET /api/complaints/:id - View complaint details
router.get('/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: req.params.id },
      include: {
        statusHistory: {
          orderBy: { createdAt: 'asc' },
        },
        feedback: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            mobile: true,
            address: true,
          },
        },
      },
    });

    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    // Role verification: citizen can only view their own complaint; admin can view any
    if (req.user.role !== 'ADMIN' && complaint.userId !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to view this complaint.',
      });
      return;
    }

    res.json({
      success: true,
      data: complaint,
    });
  } catch (error) {
    console.error('Get complaint detail error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve complaint details.' });
  }
});

// POST /api/complaints/:id/feedback - Provide citizen feedback after resolution
router.post('/:id/feedback', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: req.params.id },
    });

    if (!complaint) {
      res.status(404).json({ success: false, message: 'Complaint not found.' });
      return;
    }

    // Must be the owner
    if (complaint.userId !== req.user.id) {
      res.status(403).json({
        success: false,
        message: 'Access denied: You can only provide feedback on your own complaints.',
      });
      return;
    }

    // Must be RESOLVED
    if (complaint.status !== 'RESOLVED') {
      res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for resolved complaints.',
      });
      return;
    }

    const parsed = feedbackSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Invalid feedback data',
      });
      return;
    }

    const { rating, comment } = parsed.data;

    // Upsert feedback
    const feedback = await prisma.feedback.upsert({
      where: { complaintId: complaint.id },
      create: {
        complaintId: complaint.id,
        userId: req.user.id,
        rating,
        comment: comment || '',
      },
      update: {
        rating,
        comment: comment || '',
      },
    });

    res.json({
      success: true,
      message: 'Thank you for your feedback! It helps improve our Gram Panchayat services.',
      data: feedback,
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit feedback.' });
  }
});

export default router;
