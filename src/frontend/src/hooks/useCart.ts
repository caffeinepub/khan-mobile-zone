import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useProducts } from './useProducts';
import type { Cart, ProductId } from '@/backend';

interface EnrichedCartItem {
    productId: bigint;
    quantity: bigint;
    product?: {
        id: bigint;
        name: string;
        imageUrl: string;
        pricePkr: bigint;
    };
}

interface EnrichedCart {
    items: EnrichedCartItem[];
}

export function useCart() {
    const { actor, isFetching: actorFetching } = useActor();
    const { data: products = [] } = useProducts();

    return useQuery<EnrichedCart>({
        queryKey: ['cart'],
        queryFn: async () => {
            if (!actor) return { items: [] };
            const cart = await actor.getCart();

            const enrichedItems = cart.items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return {
                    ...item,
                    product: product
                        ? {
                              id: product.id,
                              name: product.name,
                              imageUrl: product.imageUrl,
                              pricePkr: product.pricePkr
                          }
                        : undefined
                };
            });

            return { items: enrichedItems };
        },
        enabled: !!actor && !actorFetching
    });
}

export function useCartCount() {
    const { data: cart } = useCart();
    return useQuery({
        queryKey: ['cartCount'],
        queryFn: () => {
            return cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;
        },
        enabled: !!cart
    });
}

export function useAddToCart() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity }: { productId: ProductId; quantity: bigint }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addToCart(productId, quantity);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cartCount'] });
        }
    });
}

export function useUpdateCartItem() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ productId, quantity }: { productId: ProductId; quantity: bigint }) => {
            if (!actor) throw new Error('Actor not available');
            await actor.clearCart();
            const cart = await actor.getCart();
            for (const item of cart.items) {
                if (item.productId !== productId) {
                    await actor.addToCart(item.productId, item.quantity);
                }
            }
            if (quantity > BigInt(0)) {
                await actor.addToCart(productId, quantity);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cartCount'] });
        }
    });
}

export function useUpdateCart() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (cart: Cart) => {
            if (!actor) throw new Error('Actor not available');
            await actor.clearCart();
            for (const item of cart.items) {
                await actor.addToCart(item.productId, item.quantity);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            queryClient.invalidateQueries({ queryKey: ['cartCount'] });
        }
    });
}
