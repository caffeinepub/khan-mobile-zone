import { Heart } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function SiteFooter() {
    return (
        <footer className="border-t border-border/40 bg-muted/30">
            <div className="container py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <h3 className="font-bold text-lg mb-2">Khan Mobile Zone</h3>
                        <p className="text-sm text-muted-foreground">
                            Your trusted destination for premium smartphones and accessories.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-2">Quick Links</h4>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link to="/mobiles" className="hover:text-foreground transition-colors">
                                Mobiles
                            </Link>
                            <Link to="/accessories" className="hover:text-foreground transition-colors">
                                Accessories
                            </Link>
                            <Link to="/about" className="hover:text-foreground transition-colors">
                                About Us
                            </Link>
                            <Link to="/contact" className="hover:text-foreground transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-2">Contact</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                            <p>Phone: 03079619356</p>
                            <p>Email: atookhana@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
                    <p className="flex items-center justify-center gap-1">
                        © 2026. Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
                        <a
                            href="https://caffeine.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:underline"
                        >
                            caffeine.ai
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
