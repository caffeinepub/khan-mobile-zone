import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '@/hooks/useCart';
import { useCheckout } from '@/hooks/useCheckout';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import DeliveryAddressForm from '@/components/checkout/DeliveryAddressForm';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import { Button } from '@/components/ui/button';
import { formatPKR } from '@/lib/format';
import { CheckCircle, Loader2 } from 'lucide-react';
import { DeliveryAddress, PaymentMethod } from '@/backend';
import LoginButton from '@/components/auth/LoginButton';
import ProfileSetupModal from '@/components/profile/ProfileSetupModal';
import { useGetCallerUserProfile } from '@/hooks/useQueries';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { identity } = useInternetIdentity();
    const { data: cart } = useCart();
    const { mutate: checkout, isPending, isSuccess, data: orderId } = useCheckout();
    const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

    const [address, setAddress] = useState<DeliveryAddress | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.cashOnDelivery);

    const isAuthenticated = !!identity;
    const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

    const cartItems = cart?.items || [];
    const total = cartItems.reduce((sum, item) => {
        const price = Number(item.product?.pricePkr || 0);
        const qty = Number(item.quantity);
        return sum + price * qty;
    }, 0);

    const handlePlaceOrder = () => {
        if (!address) return;
        checkout({ deliveryAddress: address, paymentMethod });
    };

    if (!isAuthenticated) {
        return (
            <div className="container py-12">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Login Required</h1>
                    <p className="text-muted-foreground mb-8">
                        Please login to complete your order
                    </p>
                    <LoginButton />
                </div>
            </div>
        );
    }

    if (showProfileSetup) {
        return <ProfileSetupModal />;
    }

    if (isSuccess && orderId !== undefined) {
        return (
            <div className="container py-12">
                <div className="max-w-2xl mx-auto text-center">
                    <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-muted-foreground mb-2">
                        Your order #{orderId.toString()} has been confirmed
                    </p>
                    <p className="text-muted-foreground mb-8">
                        We'll deliver to: {address?.name}, {address?.city}
                    </p>
                    <div className="bg-card rounded-lg p-6 border border-border mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Total Amount</span>
                            <span className="font-semibold">{formatPKR(total)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-semibold">
                                {paymentMethod === PaymentMethod.cashOnDelivery ? 'Cash on Delivery' : 'Online Card'}
                            </span>
                        </div>
                    </div>
                    <Button onClick={() => navigate({ to: '/' })}>
                        Continue Shopping
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <DeliveryAddressForm onAddressChange={setAddress} />
                    <PaymentMethodSelector onMethodChange={setPaymentMethod} />
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-2 mb-6">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        {item.product?.name} x {item.quantity.toString()}
                                    </span>
                                    <span>
                                        {formatPKR(Number(item.product?.pricePkr || 0) * Number(item.quantity))}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-border pt-4 mb-6">
                            <div className="flex justify-between font-semibold text-lg">
                                <span>Total</span>
                                <span>{formatPKR(total)}</span>
                            </div>
                        </div>
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handlePlaceOrder}
                            disabled={!address || isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                'Place Order'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
