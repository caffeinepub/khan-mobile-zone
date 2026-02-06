import { useCart, useUpdateCart } from '@/hooks/useCart';
import CartLineItem from '@/components/cart/CartLineItem';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPKR } from '@/lib/format';
import { Skeleton } from '@/components/ui/skeleton';

export default function CartPage() {
    const navigate = useNavigate();
    const { data: cart, isLoading } = useCart();
    const updateCart = useUpdateCart();

    const cartItems = cart?.items || [];
    const isEmpty = cartItems.length === 0;

    const total = cartItems.reduce((sum, item) => {
        const price = Number(item.product?.pricePkr || 0);
        const qty = Number(item.quantity);
        return sum + price * qty;
    }, 0);

    if (isLoading) {
        return (
            <div className="container py-12">
                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="container py-12">
                <div className="max-w-md mx-auto text-center">
                    <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
                    <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                    <p className="text-muted-foreground mb-8">
                        Start shopping to add items to your cart
                    </p>
                    <Button onClick={() => navigate({ to: '/mobiles' })}>
                        Browse Products
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map((item, idx) => (
                        <CartLineItem key={idx} item={item} />
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>{formatPKR(total)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Delivery</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="border-t border-border pt-3">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span>{formatPKR(total)}</span>
                                </div>
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={() => navigate({ to: '/checkout' })}
                        >
                            Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
