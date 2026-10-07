import {
  User,
  Complaint,
  NotificationItem,
  PortalStats,
  AdminDashboardData,
  ComplaintStatus,
} from '../types';
import { INITIAL_USERS, INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from './mockData';

const STORAGE_USERS = 'gp_mock_users';
const STORAGE_COMPLAINTS = 'gp_mock_complaints';
const STORAGE_NOTIFICATIONS = 'gp_mock_notifications';
const STORAGE_CURRENT_USER = 'gp_mock_current_user';

function getStored<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// Initialize storage with seeds if first run
export function initMockStorage() {
  if (!localStorage.getItem(STORAGE_USERS)) {
    setStored(STORAGE_USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_COMPLAINTS)) {
    setStored(STORAGE_COMPLAINTS, INITIAL_COMPLAINTS);
  }
  if (!localStorage.getItem(STORAGE_NOTIFICATIONS)) {
    setStored(STORAGE_NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
}

initMockStorage();

function getUsers(): (User & { password?: string })[] {
  return getStored(STORAGE_USERS, INITIAL_USERS);
}

function getComplaints(): Complaint[] {
  return getStored(STORAGE_COMPLAINTS, INITIAL_COMPLAINTS);
}

function getNotifications(): NotificationItem[] {
  return getStored(STORAGE_NOTIFICATIONS, INITIAL_NOTIFICATIONS);
}

export const mockService = {
  login: async (identifier: string, _password: string) => {
    initMockStorage();
    const users = getUsers();
    const cleanId = identifier.trim().toLowerCase();

    let user = users.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        u.mobile === cleanId
    );

    // If typing admin@... or starts with admin, default to admin
    if (!user && (cleanId.includes('admin') || cleanId.includes('officer'))) {
      user = users.find((u) => u.role === 'ADMIN');
    }

    // If still not found and contains @, generate or fallback to first citizen
    if (!user) {
      user = users.find((u) => u.role === 'CITIZEN') || users[0];
    }

    const token = `mock-token-${user.id}-${Date.now()}`;
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(user));

    return {
      success: true,
      token,
      user,
      message: 'Login successful (Demo Mode)',
    };
  },

  register: async (payload: any) => {
    initMockStorage();
    const users = getUsers();
    const newUser: User & { password?: string } = {
      id: `usr-cit-${Date.now()}`,
      name: payload.name || 'Citizen User',
      email: payload.email || `citizen${Date.now()}@example.com`,
      mobile: payload.mobile || '9800000000',
      address: payload.address || 'Gram Panchayat Area',
      role: 'CITIZEN',
      password: payload.password,
      createdAt: new Date().toISOString(),
      unreadNotificationsCount: 1,
      totalComplaintsCount: 0,
    };

    users.push(newUser);
    setStored(STORAGE_USERS, users);

    const token = `mock-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(newUser));

    return {
      success: true,
      token,
      user: newUser,
      message: 'Registration successful (Demo Mode)',
    };
  },

  getProfile: async () => {
    initMockStorage();
    const stored = localStorage.getItem(STORAGE_CURRENT_USER);
    if (stored) {
      try {
        const user = JSON.parse(stored);
        return { success: true, data: user };
      } catch {}
    }
    const users = getUsers();
    return { success: true, data: users[1] || users[0] };
  },

  updateProfile: async (payload: any) => {
    initMockStorage();
    const users = getUsers();
    const current = await mockService.getProfile();
    const currentId = current.data?.id;

    const idx = users.findIndex((u) => u.id === currentId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...payload };
      setStored(STORAGE_USERS, users);
      localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(users[idx]));
      return { success: true, data: users[idx] };
    }
    return { success: true, data: { ...current.data, ...payload } };
  },

  getStats: async (): Promise<{ success: boolean; data: PortalStats }> => {
    initMockStorage();
    const list = getComplaints();
    const total = list.length;
    const resolved = list.filter((c) => c.status === 'RESOLVED').length;
    const inProgress = list.filter((c) => c.status === 'IN_PROGRESS').length;
    const assigned = list.filter((c) => c.status === 'ASSIGNED').length;
    const pending = list.filter((c) => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      success: true,
      data: {
        totalComplaints: total,
        resolvedComplaints: resolved,
        inProgressComplaints: inProgress,
        pendingComplaints: pending,
        assignedComplaints: assigned,
        resolutionRate,
      },
    };
  },

  trackComplaint: async (complaintNumber: string) => {
    initMockStorage();
    const list = getComplaints();
    const c = list.find(
      (item) => item.complaintNumber.toUpperCase() === complaintNumber.trim().toUpperCase()
    );

    if (!c) {
      throw new Error(`Complaint ${complaintNumber} not found.`);
    }

    return {
      success: true,
      data: c,
    };
  },

  getComplaints: async (params: any = {}) => {
    initMockStorage();
    let list = getComplaints();
    const profile = await mockService.getProfile();
    const currentUserId = profile.data?.id;

    // Filter by user if citizen
    if (profile.data?.role === 'CITIZEN') {
      list = list.filter((c) => c.userId === currentUserId || c.user?.email === profile.data?.email);
    }

    if (params.status && params.status !== 'ALL') {
      list = list.filter((c) => c.status === params.status);
    }
    if (params.category && params.category !== 'ALL') {
      list = list.filter((c) => c.category === params.category);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.complaintNumber.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    return {
      success: true,
      data: list,
      pagination: {
        total: list.length,
        page,
        limit,
        totalPages: Math.ceil(list.length / limit) || 1,
      },
    };
  },

  getComplaintById: async (id: string) => {
    initMockStorage();
    const list = getComplaints();
    const c = list.find((item) => item.id === id || item.complaintNumber === id);
    if (!c) throw new Error('Complaint not found');
    return { success: true, data: c };
  },

  createComplaint: async (formData: FormData) => {
    initMockStorage();
    const list = getComplaints();
    const profile = await mockService.getProfile();
    const currentUser = profile.data;

    const nextNum = list.length + 1;
    const complaintNumber = `GP-2026-${String(nextNum).padStart(4, '0')}`;
    const newId = `cmp-${Date.now()}`;

    const title = (formData.get('title') as string) || 'Civic Issue';
    const category = (formData.get('category') as any) || 'Other';
    const description = (formData.get('description') as string) || '';
    const location = (formData.get('location') as string) || 'Ward Area';
    const latitude = formData.get('latitude') ? Number(formData.get('latitude')) : 18.5204;
    const longitude = formData.get('longitude') ? Number(formData.get('longitude')) : 73.8567;

    const newComplaint: Complaint = {
      id: newId,
      complaintNumber,
      userId: currentUser?.id || 'usr-cit-1',
      category,
      title,
      description,
      location,
      latitude,
      longitude,
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=800&auto=format&fit=crop&q=80',
      status: 'SUBMITTED',
      assignedDepartment: null,
      assignedStaff: null,
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
      user: {
        id: currentUser?.id,
        name: currentUser?.name || 'Citizen',
        email: currentUser?.email,
        mobile: currentUser?.mobile,
        address: currentUser?.address,
      },
      statusHistory: [
        {
          id: `sh-${Date.now()}`,
          complaintId: newId,
          status: 'SUBMITTED',
          remarks: 'Complaint submitted by citizen via Digital Portal.',
          changedBy: currentUser?.name || 'Citizen',
          createdAt: new Date().toISOString(),
        },
      ],
      feedback: null,
    };

    list.unshift(newComplaint);
    setStored(STORAGE_COMPLAINTS, list);

    return {
      success: true,
      data: newComplaint,
      message: 'Complaint submitted successfully.',
    };
  },

  submitFeedback: async (id: string, payload: { rating: number; comment?: string }) => {
    initMockStorage();
    const list = getComplaints();
    const idx = list.findIndex((c) => c.id === id || c.complaintNumber === id);
    if (idx !== -1) {
      list[idx].feedback = {
        id: `fb-${Date.now()}`,
        complaintId: list[idx].id,
        userId: list[idx].userId,
        rating: payload.rating,
        comment: payload.comment || null,
        createdAt: new Date().toISOString(),
      };
      setStored(STORAGE_COMPLAINTS, list);
    }
    return { success: true, message: 'Feedback recorded successfully.' };
  },

  // Admin APIs
  getAdminDashboard: async (): Promise<{ success: boolean; data: AdminDashboardData }> => {
    initMockStorage();
    const list = getComplaints();
    const users = getUsers();
    const total = list.length;
    const pendingReview = list.filter((c) => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length;
    const assigned = list.filter((c) => c.status === 'ASSIGNED').length;
    const inProgress = list.filter((c) => c.status === 'IN_PROGRESS').length;
    const resolved = list.filter((c) => c.status === 'RESOLVED').length;
    const rejected = list.filter((c) => c.status === 'REJECTED').length;
    const totalCitizens = users.filter((u) => u.role === 'CITIZEN').length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      success: true,
      data: {
        totalComplaints: total,
        pendingReview,
        assigned,
        inProgress,
        resolved,
        rejected,
        totalCitizens,
        resolutionRate,
        recentComplaints: list.slice(0, 6),
      },
    };
  },

  getAdminComplaints: async (params: any = {}) => {
    initMockStorage();
    let list = getComplaints();

    if (params.status && params.status !== 'ALL') {
      list = list.filter((c) => c.status === params.status);
    }
    if (params.category && params.category !== 'ALL') {
      list = list.filter((c) => c.category === params.category);
    }
    if (params.department && params.department !== 'ALL') {
      list = list.filter((c) => c.assignedDepartment === params.department);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.complaintNumber.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          (c.user?.name && c.user.name.toLowerCase().includes(q))
      );
    }

    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    return {
      success: true,
      data: list,
      pagination: {
        total: list.length,
        page,
        limit,
        totalPages: Math.ceil(list.length / limit) || 1,
      },
    };
  },

  updateStatus: async (id: string, payload: { status: ComplaintStatus; remarks?: string }) => {
    initMockStorage();
    const list = getComplaints();
    const idx = list.findIndex((c) => c.id === id || c.complaintNumber === id);
    if (idx === -1) throw new Error('Complaint not found');

    const complaint = list[idx];
    complaint.status = payload.status;
    complaint.updatedAt = new Date().toISOString();
    if (payload.status === 'RESOLVED') {
      complaint.resolvedAt = new Date().toISOString();
    }

    if (!complaint.statusHistory) complaint.statusHistory = [];
    complaint.statusHistory.push({
      id: `sh-${Date.now()}`,
      complaintId: complaint.id,
      status: payload.status,
      remarks: payload.remarks || `Status transitioned to ${payload.status}`,
      changedBy: 'Rajesh Shinde (Officer)',
      createdAt: new Date().toISOString(),
    });

    list[idx] = complaint;
    setStored(STORAGE_COMPLAINTS, list);
    return { success: true, data: complaint };
  },

  assignComplaint: async (id: string, payload: { assignedDepartment: string; assignedStaff: string; remarks?: string }) => {
    initMockStorage();
    const list = getComplaints();
    const idx = list.findIndex((c) => c.id === id || c.complaintNumber === id);
    if (idx === -1) throw new Error('Complaint not found');

    const complaint = list[idx];
    complaint.assignedDepartment = payload.assignedDepartment;
    complaint.assignedStaff = payload.assignedStaff;
    complaint.status = 'ASSIGNED';
    complaint.updatedAt = new Date().toISOString();

    if (!complaint.statusHistory) complaint.statusHistory = [];
    complaint.statusHistory.push({
      id: `sh-${Date.now()}`,
      complaintId: complaint.id,
      status: 'ASSIGNED',
      remarks: payload.remarks || `Assigned to ${payload.assignedDepartment} - ${payload.assignedStaff}`,
      changedBy: 'Rajesh Shinde (Officer)',
      createdAt: new Date().toISOString(),
    });

    list[idx] = complaint;
    setStored(STORAGE_COMPLAINTS, list);
    return { success: true, data: complaint };
  },

  getUsers: async (params: any = {}) => {
    initMockStorage();
    let users = getUsers();
    if (params.search) {
      const q = params.search.toLowerCase();
      users = users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return {
      success: true,
      data: users,
      pagination: {
        total: users.length,
        page: 1,
        limit: 10,
        totalPages: 1,
      },
    };
  },

  getAnalytics: async () => {
    initMockStorage();
    const list = getComplaints();
    const categories: Record<string, number> = {};
    const statuses: Record<string, number> = {};

    list.forEach((c) => {
      categories[c.category] = (categories[c.category] || 0) + 1;
      statuses[c.status] = (statuses[c.status] || 0) + 1;
    });

    const categoryData = Object.entries(categories).map(([category, count]) => ({ category, count }));
    const statusData = Object.entries(statuses).map(([statusKey, value]) => ({
      name: statusKey.replace('_', ' '),
      statusKey,
      value,
    }));

    const trendData = [
      { date: 'Sep 25', submitted: 3, resolved: 1 },
      { date: 'Sep 28', submitted: 4, resolved: 2 },
      { date: 'Oct 01', submitted: 2, resolved: 3 },
      { date: 'Oct 04', submitted: 5, resolved: 4 },
      { date: 'Oct 07', submitted: 2, resolved: 2 },
    ];

    return {
      success: true,
      data: {
        categoryData,
        statusData,
        trendData,
        totalInRange: list.length,
      },
    };
  },

  getReports: async () => {
    initMockStorage();
    const list = getComplaints();
    const total = list.length;
    const resolved = list.filter((c) => c.status === 'RESOLVED').length;
    const inProgress = list.filter((c) => c.status === 'IN_PROGRESS').length;
    const pending = list.filter((c) => ['SUBMITTED', 'UNDER_REVIEW'].includes(c.status)).length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    return {
      success: true,
      data: {
        total,
        resolved,
        inProgress,
        pending,
        resolutionRate,
        avgResolutionDays: 2.8,
      },
    };
  },

  getNotifications: async () => {
    initMockStorage();
    const notifications = getNotifications();
    return {
      success: true,
      data: notifications,
    };
  },

  markNotificationRead: async (id: string) => {
    initMockStorage();
    const notifications = getNotifications();
    const idx = notifications.findIndex((n) => n.id === id);
    if (idx !== -1) {
      notifications[idx].read = true;
      setStored(STORAGE_NOTIFICATIONS, notifications);
    }
    return { success: true };
  },

  markAllNotificationsRead: async () => {
    initMockStorage();
    const notifications = getNotifications().map((n) => ({ ...n, read: true }));
    setStored(STORAGE_NOTIFICATIONS, notifications);
    return { success: true };
  },
};
