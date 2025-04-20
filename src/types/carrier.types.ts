export interface Carrier {
    id: string;
    userId: string;
    maxWeight: number;
    maxItems: number;
    routeId: string;
    routeName?: string;
}

export interface CarrierResponse {
    ok: boolean;
    carrier?: Carrier;
    carriers?: Carrier[];
    message?: string;
}