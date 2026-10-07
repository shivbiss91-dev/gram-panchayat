import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../../services/api';
import { NotificationItem } from '../../types';
import { useToast } from '../../context/ToastContext';
import { Bell, CheckCheck, Clock, ExternalLink, Inbox } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';

export const CitizenNotificationsPage: React.FC = () => {
  const { success, error: toastError } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationApi.getAll();
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      success('All notifications marked as read.');
    } catch (err) {
      toastError('Failed to mark all as read.');
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time updates regarding status transitions, assignments, and resolution feedback.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleMarkAllRead}
            leftIcon={<CheckCheck className="w-4 h-4 text-cyber-blue" />}
          >
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-card space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 animate-pulse space-y-2">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="You are all caught up! You will receive live alerts here whenever an officer reviews or updates your complaints."
            icon={<Bell className="w-8 h-8 text-slate-400" />}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`py-4 px-3 sm:px-4 rounded-2xl transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  !item.read ? 'bg-cyan-50/40 border border-cyber-cyan/30' : 'hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
                    )}
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!item.read && (
                    <button
                      onClick={() => handleMarkSingleRead(item.id)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-200/60 transition-colors"
                    >
                      Mark read
                    </button>
                  )}

                  {item.complaintId && (
                    <Link
                      to={`/citizen/complaints/${item.complaintId}`}
                      onClick={() => handleMarkSingleRead(item.id)}
                    >
                      <Button variant="outline" size="sm" className="text-[11px] py-1 px-2.5">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Complaint
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
