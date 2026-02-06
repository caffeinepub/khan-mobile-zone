import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PaymentMethod } from '@/backend';
import { CreditCard, Banknote } from 'lucide-react';

interface PaymentMethodSelectorProps {
    onMethodChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({ onMethodChange }: PaymentMethodSelectorProps) {
    const [selected, setSelected] = useState<'cod' | 'card'>('cod');

    const handleChange = (value: string) => {
        const method = value as 'cod' | 'card';
        setSelected(method);
        onMethodChange(method === 'cod' ? PaymentMethod.cashOnDelivery : PaymentMethod.onlineCard);
    };

    return (
        <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <RadioGroup value={selected} onValueChange={handleChange}>
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-chart-1 transition-colors cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-chart-1" />
                        <div>
                            <p className="font-medium">Cash on Delivery</p>
                            <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                        </div>
                    </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:border-chart-1 transition-colors cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-chart-2" />
                        <div>
                            <p className="font-medium">Online Card Payment</p>
                            <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                        </div>
                    </Label>
                </div>
            </RadioGroup>
        </div>
    );
}
