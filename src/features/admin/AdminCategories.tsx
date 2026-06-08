import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import type { Category } from '@/types';
import { slugify } from '@/lib/utils';

function useAdminCategories() {
  return useQuery({
    queryKey: ['categories', 'admin'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data as Category[];
    },
  });
}

interface CategoryModalProps {
  category?: Category;
  onClose: () => void;
}

function CategoryModal({ category, onClose }: CategoryModalProps) {
  const [name, setName] = useState(category?.name || '');
  const [icon, setIcon] = useState(category?.icon || '');
  const [loading, setLoading] = useState(false);
  const qc = useQueryClient();

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error('Name required');
    setLoading(true);
    try {
      if (category) {
        await supabase.from('categories').update({ name, icon, slug: slugify(name) }).eq('id', category.id);
        toast.success('Category updated!');
      } else {
        await supabase.from('categories').insert({ name, icon, slug: slugify(name) });
        toast.success('Category created!');
      }
      qc.invalidateQueries({ queryKey: ['categories'] });
      onClose();
    } catch { toast.error('Error saving category'); }
    finally { setLoading(false); }
  };

  const icons = ['🪟', '📊', '🛡️', '🔒', '🎨', '🎮', '📱', '💾', '🖥️', '⚡', '🔑', '📦'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md rounded-3xl border p-6"
        style={{ background: '#12152A', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{category ? 'Edit Category' : 'Add Category'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <Input label="Category Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Windows Licenses" />

          <div>
            <p className="text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Icon (emoji)</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {icons.map((i) => (
                <button
                  key={i}
                  onClick={() => setIcon(i)}
                  className={`w-9 h-9 rounded-lg text-lg transition-all ${icon === i ? 'ring-2 ring-purple-500' : 'hover:bg-white/10'}`}
                >
                  {i}
                </button>
              ))}
            </div>
            <Input value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Or type emoji..." />
          </div>

          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <Button onClick={handleSubmit} isLoading={loading} className="flex-1">
              {category ? 'Update' : 'Create'} Category
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function AdminCategories() {
  const { data: categories, isLoading } = useAdminCategories();
  const [showModal, setShowModal] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | undefined>();
  const qc = useQueryClient();

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    qc.invalidateQueries({ queryKey: ['categories'] });
    toast.success('Deleted');
  };

  return (
    <>
      <Helmet><title>Categories — Admin</title></Helmet>

      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Categories</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Organize your products
            </p>
          </div>
          <Button onClick={() => { setEditCategory(undefined); setShowModal(true); }} className="gap-2">
            <Plus size={16} /> Add Category
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 rounded-2xl skeleton" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {categories?.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-5 rounded-2xl border"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <span className="text-3xl">{cat.icon || '📦'}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{cat.name}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>/{cat.slug}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setEditCategory(cat); setShowModal(true); }}
                    className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all"
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-xl text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
            {categories?.length === 0 && (
              <div className="text-center py-12 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                No categories yet. Create one!
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <CategoryModal category={editCategory} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
