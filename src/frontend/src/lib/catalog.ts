export function getBrandName(brandId: bigint): string {
    const id = Number(brandId);
    switch (id) {
        case 1:
            return 'Oppo';
        case 2:
            return 'Vivo';
        case 3:
            return 'Infinix';
        default:
            return 'Unknown';
    }
}
