import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { DeliveryAddress, PaymentMethod, OrderId } from '@/backend';

export function useCheckout() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation<OrderId, Error, { deliveryAddress: DeliveryAddress; paymentMethod: PaymentMethod }>({
        mutationFn: async ({ deliveryAddress, paymentMethod }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.checkout(deliveryAddress, paymentMethod);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cartCount'] });
        }
    });
}
