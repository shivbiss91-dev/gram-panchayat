import { z } from 'zod';

export const COMPLAINT_CATEGORIES = [
  'Road Issues',
  'Street Light Problems',
  'Water Supply Issues',
  'Drainage & Sanitation',
  'Waste Management',
  'Public Facilities',
  'Other',
] as const;

export const COMPLAINT_STATUSES = [
  'SUBMITTED',
  'UNDER_REVIEW',
  'ASSIGNED',
  'IN_PROGRESS',
  'RESOLVED',
  'REJECTED',
] as const;

export const DEPARTMENTS = [
  'Road Maintenance',
  'Water Supply',
  'Sanitation',
  'Street Lighting',
  'Waste Management',
  'Public Facilities',
  'Administration',
] as const;

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Full name must be at least 2 characters').max(100, 'Full name too long'),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  mobile: z.string().trim().regex(/^[0-9]{10}$/, 'Mobile number must be a valid 10-digit number'),
  address: z.string().trim().min(5, 'Address must be at least 5 characters').max(300, 'Address is too long'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or Mobile number is required'),
  password: z.string().min(1, 'Password is required'),
});

export const complaintCreateSchema = z.object({
  category: z.enum(COMPLAINT_CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid complaint category' }),
  }),
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150, 'Title cannot exceed 150 characters'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000, 'Description cannot exceed 2000 characters'),
  location: z.string().trim().min(4, 'Location must be at least 4 characters').max(250, 'Location cannot exceed 250 characters'),
  latitude: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().optional()),
  longitude: z.preprocess((val) => (val === '' || val === undefined ? undefined : Number(val)), z.number().optional()),
});

export const updateStatusSchema = z.object({
  status: z.enum(COMPLAINT_STATUSES, {
    errorMap: () => ({ message: 'Invalid complaint status' }),
  }),
  remarks: z.string().trim().max(500, 'Remarks cannot exceed 500 characters').optional(),
});

export const assignComplaintSchema = z.object({
  assignedDepartment: z.string().trim().min(2, 'Department is required').max(100),
  assignedStaff: z.string().trim().min(2, 'Staff name is required').max(100),
  remarks: z.string().trim().max(500).optional(),
});

export const feedbackSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  comment: z.string().trim().max(500, 'Comment cannot exceed 500 characters').optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().trim().email('Invalid email address').toLowerCase(),
  mobile: z.string().trim().regex(/^[0-9]{10}$/, 'Mobile number must be a valid 10-digit number'),
  address: z.string().trim().min(5, 'Address must be at least 5 characters').max(300),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').max(100),
});
