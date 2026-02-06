import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Product } from '@/backend';

interface ProductEditorProps {
    product: Product | null;
    onSave: (product: Product) => void;
    onCancel: () => void;
}

export default function ProductEditor({ product, onSave, onCancel }: ProductEditorProps) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'mobile' as 'mobile' | 'accessory',
        brandId: '1',
        pricePkr: '',
        stock: '',
        imageUrl: ''
    });

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                category: product.category as 'mobile' | 'accessory',
                brandId: product.brandId.toString(),
                pricePkr: product.pricePkr.toString(),
                stock: product.stock.toString(),
                imageUrl: product.imageUrl
            });
        }
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const productData: Product = {
            id: product?.id || BigInt(0),
            name: formData.name,
            category: formData.category,
            brandId: BigInt(formData.brandId),
            pricePkr: BigInt(formData.pricePkr),
            stock: BigInt(formData.stock),
            imageUrl: formData.imageUrl,
            addedOn: product?.addedOn || BigInt(Date.now()) * BigInt(1000000)
        };

        onSave(productData);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-lg border border-border p-6">
                <div>
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select
                            value={formData.category}
                            onValueChange={(value) =>
                                setFormData((prev) => ({ ...prev, category: value as 'mobile' | 'accessory' }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="mobile">Mobile</SelectItem>
                                <SelectItem value="accessory">Accessory</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.category === 'mobile' && (
                        <div>
                            <Label htmlFor="brand">Brand *</Label>
                            <Select
                                value={formData.brandId}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, brandId: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Oppo</SelectItem>
                                    <SelectItem value="2">Vivo</SelectItem>
                                    <SelectItem value="3">Infinix</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="price">Price (PKR) *</Label>
                        <Input
                            id="price"
                            type="number"
                            value={formData.pricePkr}
                            onChange={(e) => setFormData((prev) => ({ ...prev, pricePkr: e.target.value }))}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="stock">Stock *</Label>
                        <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData((prev) => ({ ...prev, stock: e.target.value }))}
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="imageUrl">Image URL *</Label>
                    <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="https://example.com/image.jpg"
                        required
                    />
                </div>

                <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                        {product ? 'Update Product' : 'Add Product'}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
