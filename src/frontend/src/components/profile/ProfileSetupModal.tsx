import { useState } from 'react';
import { useSaveCallerUserProfile } from '@/hooks/useQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function ProfileSetupModal() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const saveProfile = useSaveCallerUserProfile();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name.trim() === '') return;
        saveProfile.mutate(formData);
    };

    return (
        <Dialog open={true}>
            <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Complete Your Profile</DialogTitle>
                    <DialogDescription>
                        Please provide your details to continue
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                            placeholder="03XX XXXXXXX"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={saveProfile.isPending}>
                        {saveProfile.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Continue'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
