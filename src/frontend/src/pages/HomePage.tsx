import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Smartphone, Headphones, Shield } from 'lucide-react';
import ExplosivePhoneHero from '@/components/home/ExplosivePhoneHero';

export default function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <ExplosivePhoneHero />

            {/* Features Section */}
            <section className="py-16 bg-muted/30">
                <div className="container">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center mb-4">
                                <Smartphone className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Premium Brands</h3>
                            <p className="text-sm text-muted-foreground">
                                Oppo, Vivo, and Infinix - the latest models at competitive prices
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-chart-2 to-chart-3 flex items-center justify-center mb-4">
                                <Headphones className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Quality Accessories</h3>
                            <p className="text-sm text-muted-foreground">
                                Complete range of accessories to protect and enhance your device
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-chart-3 to-chart-4 flex items-center justify-center mb-4">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Secure Shopping</h3>
                            <p className="text-sm text-muted-foreground">
                                Safe online ordering with cash on delivery and card payment options
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container">
                    <div className="bg-gradient-to-r from-chart-1/20 to-chart-2/20 rounded-2xl p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
                        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                            Browse our collection of premium smartphones and accessories. Fast delivery across Pakistan.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                size="lg"
                                onClick={() => navigate({ to: '/mobiles' })}
                                className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90"
                            >
                                Shop Mobiles <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => navigate({ to: '/accessories' })}
                            >
                                Shop Accessories
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
