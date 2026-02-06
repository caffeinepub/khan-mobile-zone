import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ReactNode } from 'react';

interface AccessDeniedScreenProps {
    message?: string;
    actions?: ReactNode;
}

export default function AccessDeniedScreen({ 
    message = "You don't have permission to access this page. Admin privileges are required.",
    actions
}: AccessDeniedScreenProps) {
    const navigate = useNavigate();

    return (
        <div className="max-w-md mx-auto text-center">
            <ShieldAlert className="h-24 w-24 text-destructive mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8">
                {message}
            </p>
            {actions || (
                <Button onClick={() => navigate({ to: '/' })}>
                    Go to Home
                </Button>
            )}
        </div>
    );
}
