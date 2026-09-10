import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { AppNotification } from '../types';
import { EmptyState } from '../components/EmptyState';

interface NotificationsProps {
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkAllRead,
  onNotificationClick,
}) => {
  return (
    <div className="page active" id="notificationsPage">
      <div className="section-title">
        <span>Notifications</span>
        {notifications.some((n) => !n.read) && (
          <button
            onClick={onMarkAllRead}
            className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div id="notificationsList" className="space-y-2">
        {notifications.length === 0 ? (
          <EmptyState
            icon="bell"
            title="No notifications"
            message="Match updates, announcements, and wallet receipts will appear here."
          />
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                !n.read
                  ? 'border-primary/40 bg-primary/5'
                  : 'border-white/10 bg-white/5 opacity-80'
              }`}
              onClick={() => onNotificationClick(n)}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  !n.read ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'
                }`}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="font-bold text-sm text-white truncate">{n.title}</h4>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                </div>
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-gray-500 mt-1 block">
                  {new Date(n.timestamp).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
