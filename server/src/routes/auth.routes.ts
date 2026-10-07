import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../database';
import { generateToken, authenticate } from '../middleware/auth';
import { AuthenticatedRequest } from '../types';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../validators/schemas';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req, res: Response): Promise<void> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Invalid input data',
      });
      return;
    }

    const { name, email, mobile, address, password } = parsed.data;

    // Check duplicate email
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
      return;
    }

    // Check duplicate mobile
    const existingMobile = await prisma.user.findUnique({
      where: { mobile },
    });
    if (existingMobile) {
      res.status(400).json({
        success: false,
        message: 'An account with this mobile number already exists.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        mobile,
        address,
        passwordHash,
        role: 'CITIZEN',
      },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      name: user.name,
      role: user.role as 'CITIZEN' | 'ADMIN',
    });

    res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during registration. Please try again.',
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res: Response): Promise<void> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Invalid login credentials',
      });
      return;
    }

    const { identifier, password } = parsed.data;
    const cleanId = identifier.trim().toLowerCase();

    // Search by email or mobile
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanId },
          { mobile: identifier.trim() },
        ],
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email/mobile or password.',
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email/mobile or password.',
      });
      return;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      mobile: user.mobile,
      name: user.name,
      role: user.role as 'CITIZEN' | 'ADMIN',
    });

    res.json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred during login. Please try again.',
    });
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res: Response): void => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            notifications: {
              where: { read: false },
            },
            complaints: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    res.json({
      success: true,
      user: {
        ...user,
        unreadNotificationsCount: user._count.notifications,
        totalComplaintsCount: user._count.complaints,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Could not fetch profile details.' });
  }
});

// PATCH /api/auth/profile
router.patch('/profile', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parsed = updateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Invalid profile information',
      });
      return;
    }

    const { name, email, mobile, address } = parsed.data;

    // Check if email taken by someone else
    const emailConflict = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: req.user.id },
      },
    });
    if (emailConflict) {
      res.status(400).json({
        success: false,
        message: 'This email is already in use by another account.',
      });
      return;
    }

    // Check if mobile taken by someone else
    const mobileConflict = await prisma.user.findFirst({
      where: {
        mobile,
        NOT: { id: req.user.id },
      },
    });
    if (mobileConflict) {
      res.status(400).json({
        success: false,
        message: 'This mobile number is already in use by another account.',
      });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email, mobile, address },
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: updated,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// PATCH /api/auth/change-password
router.patch('/change-password', authenticate, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        success: false,
        message: parsed.error.errors[0]?.message || 'Invalid password data',
      });
      return;
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({
        success: false,
        message: 'Incorrect current password.',
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { passwordHash },
    });

    res.json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to change password.' });
  }
});

export default router;
