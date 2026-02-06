import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/catalog/ProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getBrandName } from '@/lib/catalog';

export default function MobilesPage() {
    const { data: products = [], isLoading } = useProducts();
    const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

    const mobileProducts = products.filter((p) => p.category === 'mobile');

    const filteredProducts =
        selectedBrand !== null ? mobileProducts.filter((p) => p.brandId === BigInt(selectedBrand)) : mobileProducts;

    const brands = [
        { id: 1, name: 'Oppo' },
        { id: 2, name: 'Vivo' },
        { id: 3, name: 'Infinix' }
    ];

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Mobile Phones</h1>
                <p className="text-muted-foreground">Browse our collection of premium smartphones</p>
            </div>

            {/* Brand Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
                <Button
                    variant={selectedBrand === null ? 'default' : 'outline'}
                    onClick={() => setSelectedBrand(null)}
                >
                    All Brands
                </Button>
                {brands.map((brand) => (
                    <Button
                        key={brand.id}
                        variant={selectedBrand === brand.id ? 'default' : 'outline'}
                        onClick={() => setSelectedBrand(brand.id)}
                    >
                        {brand.name}
                    </Button>
                ))}
            </div>

            {/* Products Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={Number(product.id)} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
