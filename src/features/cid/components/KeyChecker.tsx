import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type KeyResult = {
  id?: number;
  key?: string;
  description?: string;
  subtype?: string;
  key_status?: string;
  time?: string;
};

export function KeyChecker() {
  const [keysText, setKeysText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<KeyResult[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResults([]);

    // Parse keys from textarea
    const rawLines = keysText.split('\n').map(line => line.trim()).filter(Boolean);
    
    if (rawLines.length === 0) {
      toast.error('Please enter at least one key');
      return;
    }

    if (rawLines.length > 20) {
      toast.error('Maximum 20 keys allowed per request');
      return;
    }

    const payload = rawLines.map(k => ({ key: k }));

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('sys-verify-2', {
        body: payload
      });

      if (error) {
        throw new Error(error.message);
      }

      // Check if data is an error string or object
      if (data?.status === 'Error') {
        setErrorMsg(data.res || 'An unknown error occurred from the API.');
        toast.error('Failed to check keys');
      } else if (data?.status === 'Success' && Array.isArray(data.res)) {
        setResults(data.res);
        toast.success(`Successfully checked ${data.res.length} keys!`);
      } else {
        // Fallback or unmapped response
        setErrorMsg(`Unexpected response: ${JSON.stringify(data)}`);
      }

    } catch (err: any) {
      console.error('Error checking keys:', err);
      setErrorMsg('Network or server error occurred while checking keys.');
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return 'text-white/50';
    const s = status.toLowerCase();
    if (s.includes('active')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (s.includes('redeemed')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    if (s.includes('scrapped') || s.includes('fail') || s.includes('blocked')) return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (s.includes('deactivated')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-white/70 bg-white/5 border-white/10';
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#34D399] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#10B981]/30">
          KEY
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2">Bulk Key Checker</h2>
      <p className="text-white/50 text-center mb-8 text-sm">
        Paste your product keys below (one per line, up to 20 keys).
      </p>

      <form onSubmit={handleCheckKeys} className="space-y-6">
        <div>
          <label htmlFor="keys" className="block text-sm font-medium text-white/70 mb-2">
            Product Keys
          </label>
          <textarea
            id="keys"
            value={keysText}
            onChange={(e) => setKeysText(e.target.value)}
            placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX&#10;XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
            rows={5}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 transition-all resize-y font-mono text-sm"
            disabled={loading}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${keysText.split('\n').filter(Boolean).length > 20 ? 'text-red-400' : 'text-white/40'}`}>
              {keysText.split('\n').filter(Boolean).length} / 20 keys
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || keysText.trim() === ''}
          className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-[#10B981]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Check Keys'
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
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                  <div className="font-mono text-white break-all">{item.key || 'Unknown Key'}</div>
                  <div className={`px-2.5 py-1 rounded-md border text-xs font-semibold whitespace-nowrap w-fit ${getStatusColor(item.key_status || item.description)}`}>
                    {item.key_status || 'Unknown Status'}
                  </div>
                </div>
                
                {item.description && (
                  <div className="text-white/70 mt-2 mb-1">
                    {item.description}
                  </div>
                )}
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40 mt-3 border-t border-white/5 pt-3">
                  {item.subtype && <div>Subtype: <span className="text-white/60">{item.subtype}</span></div>}
                  {item.time && <div>Checked: <span className="text-white/60">{item.time}</span></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
