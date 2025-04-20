export interface Route {
    id: string;
    name: string;
    origin: string;
    destination: string;
}

export interface RouteResponse {
    ok: boolean;
    route?: Route;
    routes?: Route[];
    message?: string;
}