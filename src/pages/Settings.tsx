import React from 'react';
import { Moon, Sun, Globe, Shield, FileText, Info } from 'lucide-react';

interface SettingsProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  theme,
  onToggleTheme,
  language,
  onChangeLanguage,
}) => {
  return (
    <div className="page active" id="settingsPage">
      <div className="section-title">
        <span>App Settings</span>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-warning" />
              )}
              <div>
                <div className="font-bold text-sm text-white">Appearance Theme</div>
                <div className="text-xs text-gray-400">
                  {theme === 'dark' ? 'Dark Mode (Default)' : 'Light Mode'}
                </div>
              </div>
            </div>
            <button
              onClick={onToggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                theme === 'dark' ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-4 rounded-2xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-info" />
              <div>
                <div className="font-bold text-sm text-white">Display Language</div>
                <div className="text-xs text-gray-400">Choose preferred app language</div>
              </div>
            </div>
            <select
              className="form-input text-xs py-1.5 px-3 w-auto"
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
            </select>
          </div>
        </div>

        <div className="p-4 rounded-2xl border space-y-3" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
          <div
            className="flex items-center justify-between cursor-pointer py-1"
            onClick={() => window.open('https://battlezone-x7.onrender.com', '_blank')}
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-sm text-white">Fair Play & Anti-Cheat Policy</span>
            </div>
          </div>
          <div
            className="flex items-center justify-between cursor-pointer py-1"
            onClick={() => window.open('https://battlezone-x7.onrender.com', '_blank')}
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <span className="font-semibold text-sm text-white">Terms of Service & Rules</span>
            </div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>BattleZone X Client Version</span>
            </div>
            <span className="font-mono">v7.2.0 (Build 2026.09)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
