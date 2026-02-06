import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/catalog/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Headphones, Cable, Shield, Smartphone } from 'lucide-react';

export default function AccessoriesPage() {
    const { data: products = [], isLoading } = useProducts();

    const accessoryProducts = products.filter((p) => p.category === 'accessory');

    const categories = [
        { icon: Headphones, label: 'Audio' },
        { icon: Cable, label: 'Chargers' },
        { icon: Shield, label: 'Protection' },
        { icon: Smartphone, label: 'Cases' }
    ];

    return (
        <div className="container py-12">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Accessories</h1>
                <p className="text-muted-foreground">
                    Complete your mobile experience with quality accessories
                </p>
            </div>

            {/* Category Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {categories.map((cat, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col items-center justify-center p-6 rounded-lg bg-card border border-border hover:border-chart-1 transition-colors"
                    >
                        <cat.icon className="h-8 w-8 mb-2 text-chart-1" />
                        <span className="text-sm font-medium">{cat.label}</span>
                    </div>
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
            ) : accessoryProducts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No accessories available yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {accessoryProducts.map((product) => (
                        <ProductCard key={Number(product.id)} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
