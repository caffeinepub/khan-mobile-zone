import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './pages/HomePage';
import MobilesPage from './pages/MobilesPage';
import AccessoriesPage from './pages/AccessoriesPage';
import AboutProfilePage from './pages/AboutProfilePage';
import ContactPage from './pages/ContactPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';

const rootRoute = createRootRoute({
    component: SiteLayout
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomePage
});

const mobilesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/mobiles',
    component: MobilesPage
});

const accessoriesRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/accessories',
    component: AccessoriesPage
});

const aboutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/about',
    component: AboutProfilePage
});

const contactRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/contact',
    component: ContactPage
});

const cartRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/cart',
    component: CartPage
});

const checkoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/checkout',
    component: CheckoutPage
});

const adminRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: AdminPage
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    mobilesRoute,
    accessoriesRoute,
    aboutRoute,
    contactRoute,
    cartRoute,
    checkoutRoute,
    adminRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <RouterProvider router={router} />
            <Toaster />
        </ThemeProvider>
    );
}
