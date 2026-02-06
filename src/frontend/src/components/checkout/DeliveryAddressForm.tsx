import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DeliveryAddress } from '@/backend';

interface DeliveryAddressFormProps {
    onAddressChange: (address: DeliveryAddress | null) => void;
}

export default function DeliveryAddressForm({ onAddressChange }: DeliveryAddressFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        street: '',
        city: '',
        postal: '',
        country: 'Pakistan'
    });

    useEffect(() => {
        const isValid =
            formData.name.trim() !== '' &&
            formData.phone.trim() !== '' &&
            formData.street.trim() !== '' &&
            formData.city.trim() !== '';

        if (isValid) {
            onAddressChange(formData);
        } else {
            onAddressChange(null);
        }
    }, [formData, onAddressChange]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        placeholder="Enter your full name"
                    />
                </div>
                <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="03XX XXXXXXX"
                    />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                        id="street"
                        value={formData.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                        placeholder="House/Flat number, Street name"
                    />
                </div>
                <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="City"
                    />
                </div>
                <div>
                    <Label htmlFor="postal">Postal Code</Label>
                    <Input
                        id="postal"
                        value={formData.postal}
                        onChange={(e) => handleChange('postal', e.target.value)}
                        placeholder="Postal code (optional)"
                    />
                </div>
                <div className="md:col-span-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={formData.country} disabled />
                </div>
            </div>
        </div>
    );
}
