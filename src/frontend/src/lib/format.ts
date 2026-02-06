export function formatPKR(amount: number): string {
    return `PKR ${amount.toLocaleString('en-PK')}`;
}

export function bigintToNumber(value: bigint): number {
    return Number(value);
}
