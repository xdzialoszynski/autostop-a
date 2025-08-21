import { GeocodingResult } from "./geocoding.interface";

export interface GlobalAppState {
    pseudo: string | null;
    avatar: Base64URLString | null;
    city: GeocodingResult | null;
}
