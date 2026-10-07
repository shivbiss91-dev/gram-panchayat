import { Router, Response } from 'express';
import prisma from '../database';
import { authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';

const router = Router();

// Protect all notification routes
router.use(authenticate);

// GET /api/notifications - Get all notifications for current user with unread count
router.get('/', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.notification.count({
        where: { userId: req.user.id, read: false },
      }),
    ]);

    res.json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve notifications.' });
  }
});

// PATCH /api/notifications/:id/read - Mark single notification as read
router.patch('/:id/read', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const notification = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!notification || notification.userId !== req.user.id) {
      res.status(404).json({ success: false, message: 'Notification not found.' });
      return;
    }

    const updated = await prisma.notification.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ success: false, message: 'Failed to update notification.' });
  }
});

// PATCH /api/notifications/read-all - Mark all user notifications as read
router.patch('/read-all', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    await prisma.notification.updateMany({
      where: { userId: req.user.id, read: false },
      data: { read: true },
    });

    res.json({
      success: true,
      message: 'All notifications marked as read.',
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ success: false, message: 'Failed to mark all as read.' });
  }
});

export default router;
