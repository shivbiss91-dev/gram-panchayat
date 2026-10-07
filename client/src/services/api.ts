import {
  ApiResponse,
  Complaint,
  NotificationItem,
  PortalStats,
  AdminDashboardData,
  User,
} from '../types';

const API_BASE = '/api';

/**
 * Fetch wrapper that automatically attaches JWT tokens,
 * handles Content-Type for JSON vs FormData, and standardizes error responses.
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
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

    const data = await res.json();

    if (!res.ok) {
      // If 401 Unauthorized, notify user or clear token if appropriate
      if (res.status === 401 && !endpoint.includes('/auth/login')) {
        // Token expired
        localStorage.removeItem('token');
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Network request failed. Please check your connection.');
  }
}

// 1. Auth API
export const authApi = {
  register: (payload: any) =>
    request<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { identifier: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  getProfile: () => request<User>('/auth/me'),

  updateProfile: (payload: { name: string; email: string; mobile: string; address: string }) =>
    request<User>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  changePassword: (payload: { currentPassword: string; newPassword: string }) =>
    request('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
};

// 2. Public API
export const publicApi = {
  getStats: () => request<PortalStats>('/public/stats'),

  trackComplaint: (complaintNumber: string) =>
    request<Complaint>(`/public/track/${encodeURIComponent(complaintNumber)}`),
};

// 3. Citizen Complaints API
export const complaintApi = {
  getComplaints: (params: { search?: string; status?: string; category?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.category) query.set('category', params.category);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    return request<Complaint[]>(`/complaints?${query.toString()}`);
  },

  createComplaint: (formData: FormData) =>
    request<Complaint>('/complaints', {
      method: 'POST',
      body: formData,
    }),

  getComplaintById: (id: string) => request<Complaint>(`/complaints/${id}`),

  submitFeedback: (id: string, payload: { rating: number; comment?: string }) =>
    request(`/complaints/${id}/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

// 4. Admin API
export const adminApi = {
  getDashboard: () => request<AdminDashboardData>('/admin/dashboard'),

  getComplaints: (params: {
    search?: string;
    status?: string;
    category?: string;
    department?: string;
    dateRange?: string;
    page?: number;
    limit?: number;
  } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') query.set(key, String(val));
    });

    return request<Complaint[]>(`/admin/complaints?${query.toString()}`);
  },

  getComplaintById: (id: string) => request<Complaint>(`/admin/complaints/${id}`),

  updateStatus: (id: string, payload: { status: string; remarks?: string }) =>
    request<Complaint>(`/admin/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  assignComplaint: (id: string, payload: { assignedDepartment: string; assignedStaff: string; remarks?: string }) =>
    request<Complaint>(`/admin/complaints/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  getUsers: (params: { search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    return request<any[]>(`/admin/users?${query.toString()}`);
  },

  getAnalytics: (timeRange = '30d') =>
    request<{
      categoryData: { category: string; count: number }[];
      statusData: { name: string; statusKey: string; value: number }[];
      trendData: { date: string; submitted: number; resolved: number }[];
      totalInRange: number;
    }>(`/admin/analytics?timeRange=${timeRange}`),

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
    }>(`/admin/reports?${query.toString()}`);
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
  getAll: () => request<NotificationItem[]>('/notifications'),

  markRead: (id: string) =>
    request(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),

  markAllRead: () =>
    request('/notifications/read-all', {
      method: 'PATCH',
    }),
};
