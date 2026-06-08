import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type AccountResult = {
  userName?: string;
  password?: string;
  status_acc?: string;
};

export function O365Checker() {
  const [accountsText, setAccountsText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AccountResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckAccounts = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResults([]);

    const rawLines = accountsText.split('\n').map(line => line.trim()).filter(Boolean);
    
    if (rawLines.length === 0) {
      toast.error('Please enter at least one account');
      return;
    }

    if (rawLines.length > 100) {
      toast.error('Maximum 100 accounts allowed per request');
      return;
    }

    // Parse username:password or username|password
    const payload = rawLines.map(line => {
      const match = line.match(/^([^:| ]+)[:| ]+(.*)$/);
      if (match) {
        return { userName: match[1], password: match[2] };
      }
      return { userName: line, password: '' };
    });

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('sys-verify-3', {
        body: payload
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.status === 'Error') {
        setErrorMsg(data.res || 'An unknown error occurred from the API.');
        toast.error('Failed to check accounts');
      } else if (data?.status === 'Success' && Array.isArray(data.res)) {
        setResults(data.res);
        toast.success(`Successfully checked ${data.res.length} accounts!`);
      } else {
        setErrorMsg(`Unexpected response: ${JSON.stringify(data)}`);
      }

    } catch (err: any) {
      console.error('Error checking O365 accounts:', err);
      setErrorMsg('Network or server error occurred while checking accounts.');
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-white/50 bg-white/5 border-white/10';
    
    const s = status.toLowerCase();
    
    if (s === 'valid') {
      return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
    
    if (s.includes('lock') || s.includes('incorrect') || s === 'notexist' || s === 'error') {
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    }
    
    if (s.includes('verify') || s.includes('information') || s.includes('update')) {
      return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    }
    
    return 'text-white/70 bg-white/5 border-white/10';
  };

  const formatStatusText = (status?: string) => {
    if (!status) return 'Unknown';
    // Replace underscores with spaces and capitalize
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#38BDF8] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#0EA5E9]/30">
          O365
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2">Office 365 Checker</h2>
      <p className="text-white/50 text-center mb-8 text-sm">
        Paste your accounts below (one per line, up to 100 accounts).<br/>
        Format: <code>username:password</code>
      </p>

      <form onSubmit={handleCheckAccounts} className="space-y-6">
        <div>
          <label htmlFor="accounts" className="block text-sm font-medium text-white/70 mb-2">
            Accounts
          </label>
          <textarea
            id="accounts"
            value={accountsText}
            onChange={(e) => setAccountsText(e.target.value)}
            placeholder="user@domain.com:password123&#10;test@getcid.info|Qay10285"
            rows={5}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/50 transition-all resize-y font-mono text-sm"
            disabled={loading}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${accountsText.split('\n').filter(Boolean).length > 100 ? 'text-red-400' : 'text-white/40'}`}>
              {accountsText.split('\n').filter(Boolean).length} / 100 accounts
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || accountsText.trim() === ''}
          className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-[#0EA5E9]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Check Accounts'
          )}
        </button>
      </form>

      {errorMsg && (
        <div className="mt-6 p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-sm">
          <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Error</div>
          {errorMsg}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Results</h3>
          <div className="space-y-3">
            {results.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <div className="font-mono text-white font-medium">{item.userName || 'Unknown'}</div>
                    <div className="font-mono text-white/40 text-xs mt-0.5">{item.password ? '••••••••' : ''}</div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-md border text-xs font-semibold whitespace-nowrap text-center ${getStatusColor(item.status_acc)}`}>
                    {formatStatusText(item.status_acc)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
