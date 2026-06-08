import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Package, X, Upload } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatPrice, slugify } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';
import { toast } from 'sonner';

const productSchema = z.object({
  title: z.string().min(2, 'Title required'),
  slug: z.string().min(2, 'Slug required'),
  description: z.string().optional(),
  category_id: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  price: z.coerce.number().min(0),
  sale_price: z.coerce.number().optional().nullable(),
  inventory: z.coerce.number().min(0),
  activation_instructions: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['active', 'inactive', 'draft']).default('draft'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductModalProps {
  product?: Product;
  onClose: () => void;
}

function ProductModal({ product, onClose }: ProductModalProps) {
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const [uploadingImage, setUploadingImage] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      title: product?.title || '',
      slug: product?.slug || '',
      description: product?.description || '',
      category_id: product?.category_id || '',
      brand: product?.brand || '',
      sku: product?.sku || '',
      price: product?.price || 0,
      sale_price: product?.sale_price || null,
      inventory: product?.inventory || 0,
      activation_instructions: product?.activation_instructions || '',
      featured: product?.featured || false,
      status: product?.status || 'draft',
    },
  });

  const titleValue = watch('title');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('slug', slugify(e.target.value));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product?.id) { toast.error('Save product first before uploading images'); return; }
    setUploadingImage(true);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${sanitizedName}`;
    const { data, error } = await supabase.storage.from('product-images').upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (error) { toast.error('Upload failed'); setUploadingImage(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
    await supabase.from('product_images').insert({ product_id: product.id, image_url: publicUrl, display_order: 0 });
    toast.success('Image uploaded!');
    setUploadingImage(false);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (product) {
        await updateProduct.mutateAsync({ id: product.id, ...data });
        toast.success('Product updated!');
      } else {
        await createProduct.mutateAsync(data);
        toast.success('Product created!');
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Error saving product');
    }
  };

  const categoryOptions = [
    { value: '', label: 'Select category' },
    ...(categories?.map((c) => ({ value: c.id, label: c.name })) || []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl rounded-3xl border overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: '#12152A', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <h2 className="text-xl font-bold text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto flex-1 p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                id="title" label="Title *"
                {...register('title', { onChange: handleTitleChange })}
                error={errors.title?.message}
              />
            </div>
            <Input
              id="slug" label="Slug"
              {...register('slug')}
              error={errors.slug?.message}
            />
            <Select
              id="category" label="Category"
              options={categoryOptions}
              {...register('category_id')}
            />
            <Input id="brand" label="Brand" {...register('brand')} />
            <Input id="sku" label="SKU" {...register('sku')} />
            <Input
              id="price" label="Price (₹) *" type="number"
              {...register('price')} error={errors.price?.message}
            />
            <Input
              id="sale_price" label="Sale Price (₹)" type="number"
              {...register('sale_price')}
            />
            <Input
              id="inventory" label="Inventory *" type="number"
              {...register('inventory')} error={errors.inventory?.message}
            />
            <Select
              id="status" label="Status"
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              {...register('status')}
            />
          </div>

          <Textarea
            id="description" label="Description"
            {...register('description')} rows={4}
          />
          <Textarea
            id="activation" label="Activation Instructions"
            {...register('activation_instructions')} rows={3}
          />

          <div className="flex items-center gap-3">
            <input type="checkbox" id="featured" {...register('featured')} className="w-4 h-4 accent-purple-500" />
            <label htmlFor="featured" className="text-sm text-white/70">Featured Product</label>
          </div>

          {product && (
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Product Images</p>
              <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl border border-dashed border-white/20 hover:border-purple-500/40 transition-all w-fit text-sm text-white/50 hover:text-white">
                <Upload size={15} />
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <Button
              type="submit"
              isLoading={createProduct.isPending || updateProduct.isPending}
              className="flex-1"
            >
              {product ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function AdminProducts() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | undefined>();
  const { data, isLoading } = useAdminProducts({ search });
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await deleteProduct.mutateAsync(id);
    toast.success('Product deleted');
  };

  const openEdit = (product: Product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const openCreate = () => {
    setEditProduct(undefined);
    setShowModal(true);
  };

  return (
    <>
      <Helmet><title>Products — Admin</title></Helmet>

      <div className="space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">Products</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {data?.total ?? 0} total products
            </p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} /> Add Product
          </Button>
        </div>

        <div className="w-64">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
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
                  {['Product', 'Category', 'Price', 'Inventory', 'Status', 'Featured', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.products.map((product) => {
                  const image = product.product_images?.[0]?.image_url;
                  return (
                    <tr key={product.id} className="border-b hover:bg-white/2 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            {image ? (
                              <img src={image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={16} style={{ color: 'rgba(108,71,255,0.4)' }} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white max-w-48 truncate">{product.title}</p>
                            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{product.sku || '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{product.category?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{formatPrice(product.sale_price ?? product.price)}</p>
                          {product.sale_price && (
                            <p className="text-xs line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>{formatPrice(product.price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-semibold ${product.inventory === 0 ? 'text-red-400' : product.inventory <= 5 ? 'text-amber-400' : 'text-green-400'}`}>
                          {product.inventory}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={product.status === 'active' ? 'success' : product.status === 'draft' ? 'muted' : 'danger'}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm">{product.featured ? '⭐' : '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 transition-all"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-1.5 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(undefined); }}
        />
      )}
    </>
  );
}
