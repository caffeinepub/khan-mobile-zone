import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
    const { login, clear, loginStatus, identity } = useInternetIdentity();
    const queryClient = useQueryClient();

    const isAuthenticated = !!identity;
    const disabled = loginStatus === 'logging-in';

    const handleAuth = async () => {
        if (isAuthenticated) {
            await handleLogout();
        } else {
            try {
                await login();
            } catch (error: any) {
                console.error('Login error:', error);
                if (error.message === 'User is already authenticated') {
                    await clear();
                    setTimeout(() => login(), 300);
                }
            }
        }
    };

    const handleLogout = async () => {
        await clear();
        queryClient.clear();
    };

    return (
        <Button onClick={handleAuth} disabled={disabled} size="lg">
            {disabled ? (
                <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in...
                </>
            ) : isAuthenticated ? (
                <>
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                </>
            ) : (
                <>
                    <LogIn className="mr-2 h-5 w-5" />
                    Login
                </>
            )}
        </Button>
    );
}

// Export logout helper for use in other components
export function useLogout() {
    const { clear } = useInternetIdentity();
    const queryClient = useQueryClient();

    return async () => {
        await clear();
        queryClient.clear();
    };
}
