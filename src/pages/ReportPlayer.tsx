import React, { useState } from 'react';
import { Flag, Upload, CheckCircle2 } from 'lucide-react';
import { uploadImage } from '../services/api';

interface ReportPlayerProps {
  onSubmitReport: (data: {
    targetUser: string;
    matchId: string;
    category: string;
    description: string;
    proofUrl?: string;
  }) => Promise<void>;
}

export const ReportPlayer: React.FC<ReportPlayerProps> = ({ onSubmitReport }) => {
  const [targetUser, setTargetUser] = useState('');
  const [matchId, setMatchId] = useState('');
  const [category, setCategory] = useState('Hacking / Aimbot');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Hacking / Aimbot',
    'Teaming / Match Fixing',
    'Abusive Chat / Toxicity',
    'Fake Screenshot Claim',
    'Other Issue',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser.trim()) return;

    setLoading(true);
    try {
      let proofUrl = '';
      if (file) {
        proofUrl = await uploadImage(file);
      }
      await onSubmitReport({
        targetUser: targetUser.trim(),
        matchId: matchId.trim(),
        category,
        description: description.trim(),
        proofUrl,
      });
      setTargetUser('');
      setMatchId('');
      setDescription('');
      setFile(null);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page active" id="reportPlayerPage">
      <div className="section-title">
        <span>Report Player or Issue</span>
      </div>

      <div className="p-4 rounded-2xl mb-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">
              Player Name or In-Game UID
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter suspect player IGN or UID"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">
              Tournament ID / Match Name (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Free Fire Solo Rush #104"
              value={matchId}
              onChange={(e) => setMatchId(e.target.value)}
            />
          </div>

          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1.5 block">Violation Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    category === cat
                      ? 'border-danger bg-danger/20 text-danger'
                      : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group mb-3">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">Description of Incident</label>
            <textarea
              className="form-input h-24 resize-none text-xs"
              placeholder="Provide specific details, timestamp, or behavior observed..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group mb-4">
            <label className="text-xs font-semibold text-gray-300 mb-1 block">
              Attach Screenshot or Screen Recording Proof
            </label>
            <label className="border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-danger/50 transition-colors">
              <Upload className="w-6 h-6 text-gray-400 mb-2" />
              <span className="text-xs text-gray-400">
                {file ? file.name : 'Select screenshot proof file'}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </label>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-h-36 object-cover rounded-lg mt-2 border border-white/10"
              />
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="spinner" /> : <span>Submit Official Report</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
