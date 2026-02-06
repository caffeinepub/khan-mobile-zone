import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Menu, X, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCartCount } from '@/hooks/useCart';
import { useState } from 'react';

export default function SiteHeader() {
    const navigate = useNavigate();
    const { data: cartCount = 0 } = useCartCount();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/mobiles', label: 'Mobiles' },
        { to: '/accessories', label: 'Accessories' },
        { to: '/about', label: 'About' },
        { to: '/contact', label: 'Contact' },
        { to: '/admin', label: 'Admin' }
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-chart-1 to-chart-2">
                        <Smartphone className="h-6 w-6 text-white" />
                    </div>
                    <span className="hidden sm:inline-block bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
                        Khan Mobile Zone
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            activeProps={{ className: 'text-foreground' }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Cart & Mobile Menu */}
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={() => navigate({ to: '/cart' })}
                    >
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                            >
                                {cartCount}
                            </Badge>
                        )}
                    </Button>

                    {/* Mobile Menu */}
                    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                        <SheetTrigger asChild className="md:hidden">
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64">
                            <nav className="flex flex-col gap-4 mt-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground py-2"
                                        activeProps={{ className: 'text-foreground' }}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
