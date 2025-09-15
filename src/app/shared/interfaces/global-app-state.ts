import { GeocodingResult, Position } from "./geocoding.interface";

export interface GlobalAppState {
    pseudo: string | null;
    avatar: Base64URLString | null;
    city: GeocodingResult | null;
    position: Position | null;
    requestSent: boolean;
    dpecId: number | null;
}
