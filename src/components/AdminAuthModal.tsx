import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, X, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN for developer/store owner
    if (pin === 'pawdrop2026' || pin === 'admin' || pin === '1234') {
      setError(false);
      setPin('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/30 mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Merchant Vault Access</h3>
            <p className="text-xs text-slate-400 mt-1">
              Restricted to authorized store administrators & developers.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Admin Master PIN / Secret Key:
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder="Enter admin passcode"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <div className="flex items-center space-x-1.5 text-red-400 text-xs mt-2">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Incorrect passcode. (Default: pawdrop2026)</span>
              </div>
            )}
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center justify-between text-slate-300 font-medium">
              <span>Developer Quick Access:</span>
              <button
                type="button"
                onClick={() => setPin('pawdrop2026')}
                className="text-orange-400 hover:underline font-mono text-[10px]"
              >
                Insert PIN
              </button>
            </div>
            <p className="text-slate-500">PIN: <code className="text-slate-300">pawdrop2026</code> (hidden from regular shoppers)</p>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/25 transition-all"
          >
            <Key className="w-4 h-4" />
            <span>Unlock Admin Command Center</span>
          </button>
        </form>
      </div>
    </div>
  );
};
