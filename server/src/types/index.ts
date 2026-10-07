import { Request } from 'express';

export type UserRole = 'CITIZEN' | 'ADMIN';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export type ComplaintCategory =
  | 'Road Issues'
  | 'Street Light Problems'
  | 'Water Supply Issues'
  | 'Drainage & Sanitation'
  | 'Waste Management'
  | 'Public Facilities'
  | 'Other';

export interface AuthUserPayload {
  id: string;
  email: string;
  mobile: string;
  name: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}
