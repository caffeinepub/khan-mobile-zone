import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { formatPKR } from '@/lib/format';
import { getBrandName } from '@/lib/catalog';
import { useAddToCart } from '@/hooks/useCart';
import type { Product } from '@/backend';
import { toast } from 'sonner';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addToCart = useAddToCart();

    const handleAddToCart = () => {
        addToCart.mutate(
            { productId: product.id, quantity: BigInt(1) },
            {
                onSuccess: () => {
                    toast.success('Added to cart!');
                },
                onError: () => {
                    toast.error('Failed to add to cart');
                }
            }
        );
    };

    const isMobile = product.category === 'mobile';

    return (
        <div className="group bg-card rounded-lg border border-border overflow-hidden hover:border-chart-1 transition-all hover:shadow-lg">
            <div className="aspect-square overflow-hidden bg-muted">
                <img
                    src={product.imageUrl || '/placeholder.png'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </div>
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                    {isMobile && (
                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                            {getBrandName(product.brandId)}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center justify-between mt-4">
                    <span className="text-2xl font-bold text-chart-1">
                        {formatPKR(Number(product.pricePkr))}
                    </span>
                    <Button
                        size="sm"
                        onClick={handleAddToCart}
                        disabled={addToCart.isPending || product.stock === BigInt(0)}
                        className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90"
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.stock === BigInt(0) ? 'Out of Stock' : 'Buy Now'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
