import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ClaimAdminResult, TransferAdminResult } from '@/backend';

/**
 * Hook to claim admin privileges using the backend claimAdminRole capability.
 * Returns structured result indicating success, already exists, or anonymous caller.
 */
export function useClaimAdmin() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation<ClaimAdminResult, Error, void>({
        mutationFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return await actor.claimAdminRole();
        },
        onSuccess: (result) => {
            if (result === ClaimAdminResult.success) {
                // Only invalidate on success
                queryClient.invalidateQueries({ queryKey: ['callerRole'] });
            }
        },
    });
}

/**
 * Hook to transfer admin privileges to the current authenticated identity.
 * Returns structured result indicating success, authentication error, or anonymous caller.
 */
export function useTransferAdmin() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation<TransferAdminResult, Error, void>({
        mutationFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return await actor.transferAdminRole();
        },
        onSuccess: (result) => {
            if (result === TransferAdminResult.success) {
                // Invalidate role query to refresh UI immediately
                queryClient.invalidateQueries({ queryKey: ['callerRole'] });
            }
        },
    });
}
