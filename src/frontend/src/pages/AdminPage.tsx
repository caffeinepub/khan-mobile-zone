import { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useCallerRole } from '@/hooks/useCallerRole';
import { useProducts, useAddProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useClaimAdmin } from '@/hooks/useAdminBootstrap';
import { useLogout } from '@/components/auth/LoginButton';
import LoginButton from '@/components/auth/LoginButton';
import AccessDeniedScreen from '@/components/auth/AccessDeniedScreen';
import TransferAdminDialog from '@/components/admin/TransferAdminDialog';
import ProductEditor from '@/components/admin/ProductEditor';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, ShieldCheck, LogOut, RefreshCw } from 'lucide-react';
import { formatPKR } from '@/lib/format';
import { getBrandName } from '@/lib/catalog';
import { Product, UserRole, ClaimAdminResult } from '@/backend';
import ProfileSetupModal from '@/components/profile/ProfileSetupModal';
import { useGetCallerUserProfile } from '@/hooks/useQueries';

export default function AdminPage() {
    const { identity } = useInternetIdentity();
    const { data: role, isLoading: roleLoading } = useCallerRole();
    const { data: products = [], isLoading: productsLoading } = useProducts();
    const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

    const addProduct = useAddProduct();
    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();
    const claimAdmin = useClaimAdmin();
    const logout = useLogout();

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [transferDialogOpen, setTransferDialogOpen] = useState(false);

    const isAuthenticated = !!identity;
    const isAdmin = role === UserRole.admin;
    const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

    // Not logged in - show login prompt
    if (!isAuthenticated) {
        return (
            <div className="container py-12">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-3xl font-bold mb-4">Admin Access</h1>
                    <p className="text-muted-foreground mb-8">
                        Please login to access the admin panel
                    </p>
                    <LoginButton />
                </div>
            </div>
        );
    }

    // Profile setup required
    if (showProfileSetup) {
        return <ProfileSetupModal />;
    }

    // Loading role
    if (roleLoading) {
        return (
            <div className="container py-12">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    // Not admin - show unified access denied with claim/transfer options
    if (!isAdmin) {
        const claimResult = claimAdmin.data;
        const isClaimPending = claimAdmin.isPending;
        const hasClaimError = claimAdmin.isError;

        // Determine the message based on claim result
        let message = "You don't have permission to access this page. Admin privileges are required.";
        let showClaimButton = true;

        if (claimResult === ClaimAdminResult.alreadyExists) {
            message = "An admin is already configured for this application. You can either log in with the admin account or transfer admin ownership to this account.";
            showClaimButton = false;
        } else if (claimResult === ClaimAdminResult.anonymousCaller) {
            message = "You must be logged in to claim admin privileges.";
            showClaimButton = false;
        } else if (hasClaimError) {
            message = "Failed to claim admin due to a network error. Please try again.";
            showClaimButton = true;
        }

        const handleClaimAdmin = async () => {
            await claimAdmin.mutateAsync();
        };

        const handleLogoutAndSwitch = async () => {
            await logout();
        };

        return (
            <div className="container py-12">
                <AccessDeniedScreen
                    message={message}
                    actions={
                        <div className="space-y-4">
                            {claimResult === ClaimAdminResult.success ? (
                                <Alert>
                                    <AlertDescription>
                                        Admin claimed successfully! Refreshing...
                                    </AlertDescription>
                                </Alert>
                            ) : claimResult === ClaimAdminResult.alreadyExists ? (
                                <>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Button
                                            variant="outline"
                                            onClick={handleLogoutAndSwitch}
                                            className="w-full sm:w-auto"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Logout and Switch Account
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => setTransferDialogOpen(true)}
                                            className="w-full sm:w-auto"
                                        >
                                            Transfer Admin to This Account
                                        </Button>
                                    </div>
                                </>
                            ) : showClaimButton ? (
                                <div className="space-y-3">
                                    <Button
                                        onClick={handleClaimAdmin}
                                        disabled={isClaimPending}
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        {isClaimPending ? (
                                            <>
                                                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                                                Claiming Admin...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="mr-2 h-5 w-5" />
                                                Claim Admin Access
                                            </>
                                        )}
                                    </Button>
                                    {hasClaimError && (
                                        <p className="text-sm text-muted-foreground">
                                            If the problem persists, an admin may already exist.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <Button variant="outline" onClick={handleLogoutAndSwitch}>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            )}
                        </div>
                    }
                />
                <TransferAdminDialog
                    open={transferDialogOpen}
                    onOpenChange={setTransferDialogOpen}
                />
            </div>
        );
    }

    // User is admin - show admin panel
    const handleSave = (product: Product) => {
        if (editingProduct) {
            updateProduct.mutate(product);
        } else {
            addProduct.mutate(product);
        }
        setEditingProduct(null);
        setIsAdding(false);
    };

    const handleDelete = (id: bigint) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteProduct.mutate(id);
        }
    };

    if (isAdding || editingProduct) {
        return (
            <div className="container py-12">
                <ProductEditor
                    product={editingProduct}
                    onSave={handleSave}
                    onCancel={() => {
                        setEditingProduct(null);
                        setIsAdding(false);
                    }}
                />
            </div>
        );
    }

    return (
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Panel</h1>
                <Button onClick={() => setIsAdding(true)}>
                    <Plus className="mr-2 h-5 w-5" />
                    Add Product
                </Button>
            </div>

            {productsLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">No products yet</p>
                    <Button onClick={() => setIsAdding(true)}>Add Your First Product</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {products.map((product) => (
                        <div
                            key={Number(product.id)}
                            className="bg-card rounded-lg border border-border p-4 flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={product.imageUrl || '/placeholder.png'}
                                    alt={product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-semibold">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {product.category === 'mobile' ? getBrandName(product.brandId) : 'Accessory'} •{' '}
                                        {formatPKR(Number(product.pricePkr))} • Stock: {product.stock.toString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setEditingProduct(product)}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
