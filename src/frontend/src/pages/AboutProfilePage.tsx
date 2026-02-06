import { Mail, Phone } from 'lucide-react';

export default function AboutProfilePage() {
    return (
        <div className="container py-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-2xl p-8 md:p-12 border border-border">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        {/* Profile Photo */}
                        <div className="flex-shrink-0">
                            <img
                                src="/assets/profile/profile-photo.png"
                                alt="Khan Mobile Zone Owner"
                                className="w-48 h-48 rounded-full object-cover border-4 border-chart-1 shadow-xl"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold mb-4">About Khan Mobile Zone</h1>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Welcome to Khan Mobile Zone, your trusted destination for premium smartphones and
                                accessories. We specialize in bringing you the latest models from top brands like Oppo,
                                Vivo, and Infinix at competitive prices.
                            </p>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                With years of experience in the mobile industry, we pride ourselves on offering genuine
                                products, excellent customer service, and fast delivery across Pakistan. Your
                                satisfaction is our priority.
                            </p>

                            {/* Contact Info */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <a
                                    href="tel:03079619356"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Phone className="h-4 w-4" />
                                    03079619356
                                </a>
                                <a
                                    href="mailto:atookhana@gmail.com"
                                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Mail className="h-4 w-4" />
                                    atookhana@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
