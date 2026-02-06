import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    life: number;
}

export default function ExplosivePhoneHero() {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particles: Particle[] = [];
        const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#3b82f6', '#a855f7'];

        const createBurst = (x: number, y: number) => {
            const particleCount = 30;
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = 2 + Math.random() * 3;
                particles.push({
                    x,
                    y,
                    vx: Math.cos(angle) * velocity,
                    vy: Math.sin(angle) * velocity,
                    size: 2 + Math.random() * 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: 1,
                    life: 1
                });
            }
        };

        // Create initial burst
        createBurst(canvas.width / 2, canvas.height / 2);

        let animationId: number;
        let lastBurst = Date.now();

        const animate = () => {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Create periodic bursts
            if (Date.now() - lastBurst > 3000) {
                createBurst(canvas.width / 2, canvas.height / 2);
                lastBurst = Date.now();
            }

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // gravity
                p.life -= 0.01;
                p.alpha = p.life;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.globalAlpha = 1;
            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [prefersReducedMotion]);

    return (
        <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
            {/* Background Image */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'url(/assets/generated/hero-bg.dim_1600x900.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />

            {/* Canvas for particles */}
            {!prefersReducedMotion && (
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ mixBlendMode: 'screen' }}
                />
            )}

            {/* Content */}
            <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center py-16">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 bg-clip-text text-transparent">
                        Khan Mobile Zone
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground mb-6">
                        Your #1 Choice for Premium Smartphones
                    </p>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
                        Discover the latest Oppo, Vivo, and Infinix smartphones with genuine accessories. Fast
                        delivery, secure payment, and unbeatable prices.
                    </p>
                    <Button
                        size="lg"
                        onClick={() => navigate({ to: '/mobiles' })}
                        className="bg-gradient-to-r from-chart-1 to-chart-2 hover:opacity-90 text-white"
                    >
                        Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>

                {/* Phone Image */}
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <img
                            src="/assets/generated/phone-hero.dim_1200x1200.png"
                            alt="Premium Smartphone"
                            className="w-full max-w-md drop-shadow-2xl animate-pulse"
                            style={{ animationDuration: '3s' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
