import React from 'react';
import { Gamepad2, Inbox, Trophy, Users, Bell, History } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'gamepad' | 'inbox' | 'trophy' | 'users' | 'bell' | 'history';
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon = 'inbox', title, message }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'gamepad':
        return <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-gray-500" />;
      case 'trophy':
        return <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-500" />;
      case 'users':
        return <Users className="w-12 h-12 mx-auto mb-3 text-gray-500" />;
      case 'bell':
        return <Bell className="w-12 h-12 mx-auto mb-3 text-gray-500" />;
      case 'history':
        return <History className="w-12 h-12 mx-auto mb-3 text-gray-500" />;
      default:
        return <Inbox className="w-12 h-12 mx-auto mb-3 text-gray-500" />;
    }
  };

  return (
    <div className="empty-state">
      {renderIcon()}
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
};
