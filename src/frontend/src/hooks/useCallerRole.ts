import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { UserRole } from '@/backend';

export function useCallerRole() {
    const { actor, isFetching } = useActor();

    return useQuery<UserRole>({
        queryKey: ['callerRole'],
        queryFn: async () => {
            if (!actor) return UserRole.guest;
            try {
                return await actor.getCallerUserRole();
            } catch (error) {
                console.error('Error fetching role:', error);
                return UserRole.guest;
            }
        },
        enabled: !!actor && !isFetching,
        retry: false
    });
}
