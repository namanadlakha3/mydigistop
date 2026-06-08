import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Plus, Search, Upload, Copy, CheckCircle2, Clock, Package, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAdminProducts } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import type { LicenseKey } from '@/types';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils';

function useKeys(productId?: string) {
  return useQuery({
    queryKey: ['license-keys', productId],
    queryFn: async () => {
      let query = supabase.from('license_keys').select('*').order('created_at', { ascending: false });
      if (productId) query = query.eq('product_id', productId);
      const { data, error } = await query;
      if (error) throw error;
      return data as LicenseKey[];
    },
    enabled: true,
  });
}

const keyStatusVariant: Record<string, 'success' | 'warning' | 'muted'> = {
  unused: 'success',
  assigned: 'warning',
  delivered: 'muted',
};

export function AdminLicenseKeys() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newKey, setNewKey] = useState('');
  const [bulkKeys, setBulkKeys] = useState('');
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [searchFilter, setSearchFilter] = useState<string>('all');
  const { data: keys, isLoading } = useKeys(selectedProduct || undefined);
  const { data: products } = useAdminProducts();
  const qc = useQueryClient();

  const addKey = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) throw new Error('Select a product first');
      if (!newKey.trim()) throw new Error('Enter a key value');
      const { error } = await supabase.from('license_keys').insert({
        product_id: selectedProduct,
        key_value: newKey.trim(),
        status: 'unused',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setNewKey('');
      toast.success('License key added!');
      qc.invalidateQueries({ queryKey: ['license-keys'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const addBulkKeys = useMutation({
    mutationFn: async () => {
      if (!selectedProduct) throw new Error('Select a product first');
      const lines = bulkKeys.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) throw new Error('Enter at least one key');
      const { error } = await supabase.from('license_keys').insert(
        lines.map((key) => ({ product_id: selectedProduct, key_value: key, status: 'unused' }))
      );
      if (error) throw error;
      return lines.length;
    },
    onSuccess: (count) => {
      setBulkKeys('');
      toast.success(`${count} key(s) added!`);
      qc.invalidateQueries({ queryKey: ['license-keys'] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const productOptions = [
    { value: '', label: 'All Products' },
    ...(products?.products.map((p) => ({ value: p.id, label: p.title })) || []),
  ];

  const filteredKeys = keys?.filter((k) => searchFilter === 'all' || k.status === searchFilter);

  const stats = {
    unused: keys?.filter((k) => k.status === 'unused').length ?? 0,
    assigned: keys?.filter((k) => k.status === 'assigned').length ?? 0,
    delivered: keys?.filter((k) => k.status === 'delivered').length ?? 0,
  };

  const copyKey = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Copied!');
  };

  return (
    <>
      <Helmet><title>License Keys — Admin</title></Helmet>

      <div className="space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">License Keys</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Manage and distribute product license keys
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Unused', value: stats.unused, color: '#10B981' },
            { label: 'Assigned', value: stats.assigned, color: '#F59E0B' },
            { label: 'Delivered', value: stats.delivered, color: '#6B7280' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-2xl border text-center" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
              <div className="text-2xl font-black" style={{ color }}>{value}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Keys Panel */}
          <div className="p-6 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="text-lg font-bold text-white mb-4">Add Keys</h2>

            <Select
              label="Product"
              options={productOptions}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="mb-4"
            />

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setMode('single')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'single' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                style={mode === 'single' ? { background: 'rgba(108,71,255,0.2)', border: '1px solid rgba(108,71,255,0.3)' } : { border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Single
              </button>
              <button
                onClick={() => setMode('bulk')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'bulk' ? 'text-white' : 'text-white/50 hover:text-white'}`}
                style={mode === 'bulk' ? { background: 'rgba(108,71,255,0.2)', border: '1px solid rgba(108,71,255,0.3)' } : { border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Bulk
              </button>
            </div>

            {mode === 'single' ? (
              <div className="space-y-3">
                <Input
                  label="License Key"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="XXXXX-XXXXX-XXXXX"
                />
                <Button onClick={() => addKey.mutate()} isLoading={addKey.isPending} className="w-full gap-2">
                  <Plus size={16} /> Add Key
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Textarea
                  label="Keys (one per line)"
                  value={bulkKeys}
                  onChange={(e) => setBulkKeys(e.target.value)}
                  placeholder={'XXXXX-XXXXX-XXXXX\nYYYYY-YYYYY-YYYYY\n...'}
                  rows={6}
                />
                <Button onClick={() => addBulkKeys.mutate()} isLoading={addBulkKeys.isPending} className="w-full gap-2">
                  <Upload size={16} /> Upload Bulk Keys
                </Button>
              </div>
            )}
          </div>

          {/* Keys Table */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-3 mb-4">
              {['all', 'unused', 'assigned', 'delivered'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSearchFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                    searchFilter === s
                      ? 'text-white border-purple-500/40'
                      : 'text-white/50 border-white/10 hover:text-white'
                  }`}
                  style={searchFilter === s ? { background: 'rgba(108,71,255,0.15)' } : undefined}
                >
                  {s === 'all' ? 'All' : s}
                  {s !== 'all' && ` (${stats[s as keyof typeof stats] ?? 0})`}
                </button>
              ))}
            </div>

            {isLoading ? (
              <TableSkeleton rows={8} />
            ) : (
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                      {['Key Value', 'Status', 'Order', 'Added', ''].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredKeys?.map((key) => (
                      <tr key={key.id} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                        <td className="px-4 py-3">
                          <span className="font-mono text-sm text-white/80">{key.key_value}</span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={keyStatusVariant[key.status]} size="sm">
                            {key.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-xs text-white/40 font-mono">
                          {key.assigned_order_id?.slice(0, 8).toUpperCase() || '—'}
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          {formatDate(key.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => copyKey(key.key_value)}
                            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/8 transition-all"
                          >
                            <Copy size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!filteredKeys || filteredKeys.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                          No keys found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
