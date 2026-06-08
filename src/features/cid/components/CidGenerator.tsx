import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function CidGenerator() {
  const [iid, setIid] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'success' | 'error' | 'warning' | null;
    message: string;
    rawResponse?: string;
  }>({ type: null, message: '' });

  const getFriendlyMessage = (rawResponse: string) => {
    const trimmed = rawResponse.trim();
    
    // If it's a numeric string, it's a success
    if (/^\d+$/.test(trimmed)) {
      return { type: 'success' as const, message: `Confirmation ID: ${trimmed}` };
    }

    // Map specific errors to friendly messages
    const errorMap: Record<string, string> = {
      'Wrong IID.': 'Invalid Installation ID. Please check and try again.',
      'Blocked IID.': 'This Installation ID has been blocked.',
      'Exceeded IID.': 'This Installation ID has exceeded its limits.',
      'Need to call M$ Support.': 'You need to call Microsoft Support to proceed.',
      'Not legimate key. Maybe blocked.': 'Not a legitimate key. It may be blocked.',
      'Your IP reach request limit.': 'Your IP address has reached the request limit.',
      'Your IP is being locked.': 'Your IP address is currently locked.',
      'Your IID reach request limit.': 'This Installation ID has reached the request limit.',
      'Your IID is being locked.': 'This Installation ID is currently locked.',
      'Sorry, API Token cannot be empty.': 'API token configuration error. Please contact support.',
      'Sorry, your API Token does not exist.': 'Invalid API token configuration. Please contact support.',
      'Sorry, your API Token has been used 5/5 times.': 'API token limit reached. Please contact support.',
      'Server Error: Server too busy.': 'The server is currently too busy. Please try again later.',
    };

    if (errorMap[trimmed]) {
      return { type: 'error' as const, message: errorMap[trimmed] };
    }

    return { type: 'warning' as const, message: `Unexpected response: ${trimmed}` };
  };

  const handleGetCid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iid.trim()) {
      toast.error('Please enter an Installation ID');
      return;
    }

    setLoading(true);
    setResult({ type: null, message: '' });

    try {
      const { data, error } = await supabase.functions.invoke('sys-verify-1', {
        body: { iid: iid.replace(/\s+/g, '') } // remove whitespace just in case
      });

      if (error) {
        throw new Error(error.message);
      }

      const rawResponse = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      const parsedResult = getFriendlyMessage(rawResponse);
      
      setResult({ ...parsedResult, rawResponse });
      if (parsedResult.type === 'success') {
        toast.success('Successfully retrieved CID!');
      } else if (parsedResult.type === 'error') {
        toast.error('Failed to get CID');
      }

    } catch (err: any) {
      console.error('Error fetching CID:', err);
      setResult({ type: 'error', message: 'Network or server error occurred while fetching CID.' });
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C47FF] to-[#9D80FF] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#6C47FF]/30">
          CID
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2">Get Confirmation ID</h2>
      <p className="text-white/50 text-center mb-8 text-sm">
        Enter your Installation ID to generate a Confirmation ID securely.
      </p>

      <form onSubmit={handleGetCid} className="space-y-6">
        <div>
          <label htmlFor="iid" className="block text-sm font-medium text-white/70 mb-2">
            Installation ID (IID)
          </label>
          <input
            id="iid"
            type="text"
            value={iid}
            onChange={(e) => setIid(e.target.value)}
            placeholder="e.g. 5399790..."
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/50 transition-all"
            disabled={loading}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#6C47FF] hover:bg-[#5835E5] text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-[#6C47FF]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            'Get CID'
          )}
        </button>
      </form>

      {result.type && (
        <div className={`mt-6 p-4 rounded-xl border ${
          result.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
          result.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
          'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          {result.type === 'success' && <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Success</div>}
          {result.type === 'error' && <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Error</div>}
          <div className={result.type === 'success' ? 'font-mono text-lg break-all' : 'text-sm'}>
            {result.message}
          </div>

          {/* Debug raw response */}
          {result.rawResponse && (
            <div className="mt-4 pt-4 border-t border-current/20">
              <div className="text-xs uppercase tracking-wider font-bold mb-1 opacity-70">Raw API Response</div>
              <pre className="text-xs font-mono whitespace-pre-wrap break-all opacity-90 bg-black/20 p-2 rounded">
                {result.rawResponse}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
