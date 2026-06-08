import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Camera, Save } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';
import { toast } from 'sonner';

export function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user!.id);
    if (error) toast.error('Failed to update');
    else { toast.success('Profile updated!'); await refreshProfile(); }
    setSaving(false);
  };

  return (
    <>
      <Helmet><title>Profile — MyDigiStop</title></Helmet>

      <div className="space-y-8 max-w-lg">
        <h1 className="text-3xl font-black text-white">My Profile</h1>

        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="relative">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-white"
                style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
              >
                {getInitials(profile?.full_name || user?.email || 'U')}
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-white">{profile?.full_name || 'No name set'}</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{user?.email}</p>
            <p className="text-xs mt-1 px-2 py-0.5 rounded-full inline-block" style={{ background: 'rgba(108,71,255,0.12)', color: '#9B7FFF', border: '1px solid rgba(108,71,255,0.2)' }}>
              {profile?.role || 'customer'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5 p-6 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-lg font-bold text-white">Account Details</h2>

          <Input
            id="full_name"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={<User size={15} />}
          />

          <Input
            id="email"
            label="Email"
            value={user?.email || ''}
            disabled
            icon={<Mail size={15} />}
          />

          <div className="p-3 rounded-xl text-xs" style={{ background: 'rgba(108,71,255,0.08)', border: '1px solid rgba(108,71,255,0.15)', color: 'rgba(255,255,255,0.55)' }}>
            Email is managed by Google and cannot be changed here.
          </div>

          <Button onClick={handleSave} isLoading={saving} className="gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
