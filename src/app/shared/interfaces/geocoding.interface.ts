/**
 * Représente la structure minimale d'un résultat de géocodage
 * que nous utilisons dans l'application.
 */
export interface GeocodingResult {
    name: string;
    display_name: string;
    address: {
        postcode: string;
    };
    position: Position;
}

export interface Position {
    lat: number;
    lng: number;
}