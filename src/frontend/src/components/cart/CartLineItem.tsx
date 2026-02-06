import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPKR } from '@/lib/format';
import { useUpdateCartItem } from '@/hooks/useCart';

interface CartLineItemProps {
    item: {
        productId: bigint;
        quantity: bigint;
        product?: {
            id: bigint;
            name: string;
            imageUrl: string;
            pricePkr: bigint;
        };
    };
}

export default function CartLineItem({ item }: CartLineItemProps) {
    const updateItem = useUpdateCartItem();

    const product = item.product;
    if (!product) return null;

    const quantity = Number(item.quantity);
    const price = Number(product.pricePkr);
    const total = price * quantity;

    const handleUpdateQuantity = (newQty: number) => {
        if (newQty < 1) return;
        updateItem.mutate({ productId: product.id, quantity: BigInt(newQty) });
    };

    const handleRemove = () => {
        updateItem.mutate({ productId: product.id, quantity: BigInt(0) });
    };

    return (
        <div className="bg-card rounded-lg border border-border p-4 flex gap-4">
            <img
                src={product.imageUrl || '/placeholder.png'}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
            />
            <div className="flex-1">
                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{formatPKR(price)}</p>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(quantity - 1)}
                        disabled={updateItem.isPending}
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleUpdateQuantity(quantity + 1)}
                        disabled={updateItem.isPending}
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2 text-destructive"
                        onClick={handleRemove}
                        disabled={updateItem.isPending}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="text-right">
                <p className="font-semibold text-lg">{formatPKR(total)}</p>
            </div>
        </div>
    );
}
