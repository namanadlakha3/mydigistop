import { useState } from 'react';
import { Search, Eye, EyeOff, Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDate, getInitials } from '@/lib/utils';
import type { Profile } from '@/types';
import { toast } from 'sonner';

export function AdminCustomers() {
  const [search, setSearch] = useState('');
  const qc = useQueryClient();

  const { data: customers, isLoading } = useQuery({
    queryKey: ['admin-customers', search],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .eq('role', 'customer')
        .order('created_at', { ascending: false });
      if (search) query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      const { data, error, count } = await query;
      if (error) throw error;
      return { customers: data as Profile[], total: count ?? 0 };
    },
  });

  const toggleSuspend = useMutation({
    mutationFn: async ({ id, suspended }: { id: string; suspended: boolean }) => {
      const { error } = await supabase.from('profiles').update({ is_suspended: suspended }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-customers'] });
      toast.success('Customer status updated');
    },
  });

  return (
    <>
      <Helmet><title>Customers — Admin</title></Helmet>

      <div className="space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Customers</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {customers?.total ?? 0} registered customers
            </p>
          </div>
        </div>

        <div className="w-72">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            icon={<Search size={16} />}
          />
        </div>

        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Customer', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers?.customers.map((cust) => (
                  <tr key={cust.id} className="border-b hover:bg-white/2 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cust.avatar_url ? (
                          <img src={cust.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}>
                            {getInitials(cust.full_name)}
                          </div>
                        )}
                        <span className="text-sm text-white">{cust.full_name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{cust.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cust.role === 'admin' ? 'purple' : 'muted'} size="sm">
                        {cust.role === 'admin' && <Shield size={10} />}
                        {cust.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {formatDate(cust.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={cust.is_suspended ? 'danger' : 'success'} size="sm">
                        {cust.is_suspended ? 'Suspended' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleSuspend.mutate({ id: cust.id, suspended: !cust.is_suspended })}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          cust.is_suspended
                            ? 'text-green-400 border-green-500/20 hover:bg-green-500/10'
                            : 'text-red-400/70 border-red-500/20 hover:bg-red-500/10 hover:text-red-400'
                        }`}
                      >
                        {cust.is_suspended ? <><Eye size={12} /> Unsuspend</> : <><EyeOff size={12} /> Suspend</>}
                      </button>
                    </td>
                  </tr>
                ))}
                {customers?.customers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
