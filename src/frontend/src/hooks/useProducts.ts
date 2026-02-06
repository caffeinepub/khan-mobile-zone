import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, ProductId } from '@/backend';

export function useProducts() {
    const { actor, isFetching } = useActor();

    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllProducts();
        },
        enabled: !!actor && !isFetching
    });
}

export function useAddProduct() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product: Product) => {
            if (!actor) throw new Error('Actor not available');
            return actor.addProduct(product);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
}

export function useUpdateProduct() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (product: Product) => {
            if (!actor) throw new Error('Actor not available');
            return actor.updateProduct(product.id, product);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
}

export function useDeleteProduct() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: ProductId) => {
            if (!actor) throw new Error('Actor not available');
            return actor.deleteProduct(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    });
}
