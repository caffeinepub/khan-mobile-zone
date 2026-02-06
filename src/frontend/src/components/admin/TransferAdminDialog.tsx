import { useState } from 'react';
import { useTransferAdmin } from '@/hooks/useAdminBootstrap';
import { TransferAdminResult } from '@/backend';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface TransferAdminDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CONFIRMATION_PHRASE = 'TRANSFER ADMIN';

export default function TransferAdminDialog({ open, onOpenChange }: TransferAdminDialogProps) {
    const [confirmationText, setConfirmationText] = useState('');
    const transferAdmin = useTransferAdmin();

    const isConfirmed = confirmationText === CONFIRMATION_PHRASE;

    const handleTransfer = async () => {
        const result = await transferAdmin.mutateAsync();
        
        if (result === TransferAdminResult.success) {
            onOpenChange(false);
            setConfirmationText('');
        }
    };

    const handleClose = () => {
        if (!transferAdmin.isPending) {
            onOpenChange(false);
            setConfirmationText('');
            transferAdmin.reset();
        }
    };

    const getErrorMessage = () => {
        if (!transferAdmin.data) return null;
        
        switch (transferAdmin.data) {
            case TransferAdminResult.anonymousCaller:
                return 'You must be logged in to transfer admin privileges.';
            case TransferAdminResult.authenticationError:
                return 'Only the current admin can transfer admin privileges.';
            default:
                return null;
        }
    };

    const errorMessage = getErrorMessage();

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Transfer Admin Ownership
                    </DialogTitle>
                    <DialogDescription className="space-y-2 pt-2">
                        <p className="font-semibold text-foreground">
                            ⚠️ This action will override the existing admin.
                        </p>
                        <p>
                            The current admin will lose all admin privileges, and your account will become the sole admin.
                        </p>
                        <p className="text-sm">
                            This action cannot be undone without another transfer.
                        </p>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="confirmation">
                            Type <span className="font-mono font-bold">{CONFIRMATION_PHRASE}</span> to confirm:
                        </Label>
                        <Input
                            id="confirmation"
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder={CONFIRMATION_PHRASE}
                            disabled={transferAdmin.isPending}
                            className="font-mono"
                        />
                    </div>

                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertDescription>{errorMessage}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={transferAdmin.isPending}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleTransfer}
                        disabled={!isConfirmed || transferAdmin.isPending}
                        className="w-full sm:w-auto"
                    >
                        {transferAdmin.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Transferring...
                            </>
                        ) : (
                            'Transfer Admin to This Account'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
