import {
  ApiResponse,
  Complaint,
  NotificationItem,
  PortalStats,
  AdminDashboardData,
  User,
} from '../types';
import { mockService } from './mockService';

const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';

/**
 * Smart fetch wrapper that:
 * 1. Automatically uses Mock Storage on GitHub Pages (static hosting without live backend)
 * 2. Talks to the live Node.js/Express backend on localhost or when VITE_API_URL is configured
 * 3. Gracefully falls back to mock demo data if the live server is unreachable or returns 404 HTML
 * 4. Completely prevents "Unexpected token '<' is not valid JSON" errors
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  mockFallback?: () => Promise<ApiResponse<T>>
): Promise<ApiResponse<T>> {
  // If hosted on GitHub Pages and no external cloud backend URL is set, use client-side mock store
  const isGitHubPages =
    typeof window !== 'undefined' &&
    window.location.hostname.endsWith('github.io') &&
    !import.meta.env.VITE_API_URL;

  if (isGitHubPages && mockFallback) {
    try {
      return await mockFallback();
    } catch (err: any) {
      throw new Error(err.message || 'Operation failed');
    }
  }

  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Do not set Content-Type if body is FormData
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';

    // If server returned HTML (e.g. static host 404), do not attempt res.json()
    if (!contentType.includes('application/json')) {
      if (mockFallback) {
        console.warn(`[Gram Panchayat Demo] Server returned non-JSON for ${endpoint}. Using interactive demo store.`);
        return await mockFallback();
      }
      throw new Error(`Server returned HTML response (${res.status}). Ensure the backend server is running.`);
    }

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 && !endpoint.includes('/auth/login')) {
        localStorage.removeItem('token');
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error: any) {
    // If backend is offline or unreachable, smoothly fallback to mock store
    if (mockFallback) {
      console.warn(`[Gram Panchayat Demo] API unavailable for ${endpoint} (${error.message}). Using demo store.`);
      return await mockFallback();
    }
    throw new Error(error.message || 'Network request failed. Please check your connection.');
  }
}

// 1. Auth API
export const authApi = {
  register: (payload: any) =>
    request<{ token: string; user: User }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      () => mockService.register(payload)
    ),

  login: (payload: { identifier: string; password: string }) =>
    request<{ token: string; user: User }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      () => mockService.login(payload.identifier, payload.password)
    ),

  logout: () =>
    request(
      '/auth/logout',
      {
        method: 'POST',
      },
      async () => ({ success: true, message: 'Logged out successfully' })
    ),

  getProfile: () =>
    request<User>('/auth/me', {}, () => mockService.getProfile()),

  updateProfile: (payload: { name: string; email: string; mobile: string; address: string }) =>
    request<User>(
      '/auth/profile',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      () => mockService.updateProfile(payload)
    ),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    request(
      '/auth/change-password',
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      async () => ({ success: true, message: 'Password changed successfully' })
    ),
};

// 2. Public API
export const publicApi = {
  getStats: () =>
    request<PortalStats>('/public/stats', {}, () => mockService.getStats()),

  trackComplaint: (complaintNumber: string) =>
    request<Complaint>(
      `/public/track/${encodeURIComponent(complaintNumber)}`,
      {},
      () => mockService.trackComplaint(complaintNumber)
    ),
};

// 3. Citizen Complaints API
export const complaintApi = {
  getComplaints: (
    params: {
      search?: string;
      status?: string;
      category?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.category) query.set('category', params.category);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    return request<Complaint[]>(
      `/complaints?${query.toString()}`,
      {},
      () => mockService.getComplaints(params)
    );
  },

  createComplaint: (formData: FormData) =>
    request<Complaint>(
      '/complaints',
      {
        method: 'POST',
        body: formData,
      },
      () => mockService.createComplaint(formData)
    ),

  getComplaintById: (id: string) =>
    request<Complaint>(
      `/complaints/${id}`,
      {},
      () => mockService.getComplaintById(id)
    ),

  submitFeedback: (id: string, payload: { rating: number; comment?: string }) =>
    request(
      `/complaints/${id}/feedback`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
      () => mockService.submitFeedback(id, payload)
    ),
};

// 4. Admin API
export const adminApi = {
  getDashboard: () =>
    request<AdminDashboardData>(
      '/admin/dashboard',
      {},
      () => mockService.getAdminDashboard()
    ),

  getComplaints: (
    params: {
      search?: string;
      status?: string;
      category?: string;
      department?: string;
      dateRange?: string;
      page?: number;
      limit?: number;
    } = {}
  ) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') query.set(key, String(val));
    });

    return request<Complaint[]>(
      `/admin/complaints?${query.toString()}`,
      {},
      () => mockService.getAdminComplaints(params)
    );
  },

  getComplaintById: (id: string) =>
    request<Complaint>(
      `/admin/complaints/${id}`,
      {},
      () => mockService.getComplaintById(id)
    ),

  updateStatus: (id: string, payload: { status: string; remarks?: string }) =>
    request<Complaint>(
      `/admin/complaints/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      () => mockService.updateStatus(id, payload as any)
    ),

  assignComplaint: (
    id: string,
    payload: { assignedDepartment: string; assignedStaff: string; remarks?: string }
  ) =>
    request<Complaint>(
      `/admin/complaints/${id}/assign`,
      {
        method: 'PATCH',
        body: JSON.stringify(payload),
      },
      () => mockService.assignComplaint(id, payload)
    ),

  getUsers: (params: { search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    return request<any[]>(
      `/admin/users?${query.toString()}`,
      {},
      () => mockService.getUsers(params)
    );
  },

  getAnalytics: (timeRange = '30d') =>
    request<{
      categoryData: { category: string; count: number }[];
      statusData: { name: string; statusKey: string; value: number }[];
      trendData: { date: string; submitted: number; resolved: number }[];
      totalInRange: number;
    }>(
      `/admin/analytics?timeRange=${timeRange}`,
      {},
      () => mockService.getAnalytics()
    ),

  getReports: (params: { category?: string; dateRange?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.dateRange) query.set('dateRange', params.dateRange);

    return request<{
      total: number;
      resolved: number;
      inProgress: number;
      pending: number;
      resolutionRate: number;
      avgResolutionDays: number;
    }>(
      `/admin/reports?${query.toString()}`,
      {},
      () => mockService.getReports()
    );
  },

  exportCsvUrl: (params: { category?: string; status?: string; dateRange?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.category) query.set('category', params.category);
    if (params.status) query.set('status', params.status);
    if (params.dateRange) query.set('dateRange', params.dateRange);
    return `${API_BASE}/admin/reports/export?${query.toString()}`;
  },
};

// 5. Notifications API
export const notificationApi = {
  getAll: () =>
    request<NotificationItem[]>(
      '/notifications',
      {},
      () => mockService.getNotifications()
    ),

  markRead: (id: string) =>
    request(
      `/notifications/${id}/read`,
      {
        method: 'PATCH',
      },
      () => mockService.markNotificationRead(id)
    ),

  markAllRead: () =>
    request(
      '/notifications/read-all',
      {
        method: 'PATCH',
      },
      () => mockService.markAllNotificationsRead()
    ),
};
