import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#6C47FF', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Completing sign in...
        </p>
      </div>
    </div>
  );
}
