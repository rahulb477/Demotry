import React from 'react';
import { Rocket, Download } from 'lucide-react';

interface UpdateModalProps {
  title?: string;
  message?: string;
  link?: string;
  onClose: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  title = 'Update Available',
  message = 'A new version of BattleZone X is available with enhanced tournament features and security improvements.',
  link = 'https://battlezone-x7.onrender.com',
  onClose,
}) => {
  return (
    <div className="update-card-premium">
      <div className="update-icon-glow">
        <Rocket className="w-16 h-16 text-primary" />
      </div>
      <div className="update-title-premium">{title}</div>
      <div className="update-msg-premium">{message}</div>
      <div className="update-btn-group">
        <button
          className="btn btn-primary"
          onClick={() => {
            if (link) window.open(link, '_blank');
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          <span>Update Now</span>
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Later
        </button>
      </div>
    </div>
  );
};
