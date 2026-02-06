import { Mail, Phone, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
    return (
        <div className="container py-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                    <p className="text-muted-foreground">
                        Get in touch with us for any inquiries or support
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Phone */}
                    <div className="bg-card rounded-lg p-6 border border-border">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-chart-1 to-chart-2 flex items-center justify-center flex-shrink-0">
                                <Phone className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">Phone</h3>
                                <a
                                    href="tel:03079619356"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    03079619356
                                </a>
                                <div className="mt-3">
                                    <Button asChild size="sm" variant="outline">
                                        <a href="tel:03079619356">Call Now</a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="bg-card rounded-lg p-6 border border-border">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-chart-2 to-chart-3 flex items-center justify-center flex-shrink-0">
                                <Mail className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-2">Email</h3>
                                <a
                                    href="mailto:tengineer055@gmail.com"
                                    className="text-muted-foreground hover:text-foreground transition-colors break-all"
                                >
                                    tengineer055@gmail.com
                                </a>
                                <div className="mt-3">
                                    <Button asChild size="sm" variant="outline">
                                        <a href="mailto:tengineer055@gmail.com">Send Email</a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gradient-to-r from-chart-1/20 to-chart-2/20 rounded-lg p-8 text-center">
                    <MapPin className="h-12 w-12 mx-auto mb-4 text-chart-1" />
                    <h3 className="font-semibold text-lg mb-2">Visit Our Store</h3>
                    <p className="text-muted-foreground mb-4">
                        We're here to help you find the perfect mobile phone and accessories
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Business Hours: Open Daily
                    </p>
                </div>
            </div>
        </div>
    );
}
