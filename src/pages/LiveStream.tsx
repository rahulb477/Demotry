import React from 'react';
import { Youtube } from 'lucide-react';

interface LiveStreamProps {
  settings: {
    enabled?: boolean;
    url?: string;
    thumbnail?: string;
    title?: string;
  };
}

export const LiveStream: React.FC<LiveStreamProps> = ({ settings }) => {
  const title = settings?.title || 'Tournament Live Stream';
  const thumbnail =
    settings?.thumbnail ||
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80';
  const url = settings?.url || 'https://www.youtube.com';

  return (
    <div className="page active" id="liveStreamPage">
      <div className="section-title">
        <span>Tournament Live</span>
      </div>
      <div className="live-card">
        <div className="live-badge-overlay">
          <span className="w-2 h-2 rounded-full bg-white inline-block animate-pulse mr-1" />
          <span>LIVE</span>
        </div>
        <img
          id="liveThumbnailImg"
          src={thumbnail}
          alt="Live Stream"
          loading="lazy"
        />
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2
            id="liveTitleDisplay"
            style={{
              fontSize: '1.2rem',
              fontWeight: 800,
              marginBottom: '15px',
            }}
          >
            {title}
          </h2>
          <button
            className="live-watch-btn"
            id="watchNowBtn"
            onClick={() => window.open(url, '_blank')}
          >
            <Youtube className="w-5 h-5 mr-2 inline" />
            <span>WATCH NOW</span>
          </button>
        </div>
      </div>
    </div>
  );
};
