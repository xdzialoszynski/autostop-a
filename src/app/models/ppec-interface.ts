export interface Ppec {

    positionGps: string;
    horodatage: number; // timestamp
    photo: string; // La photo sera envoyée encodée en Base64
    pseudo: string;
    destination: string;
    identifiantSession: string;
    ppecStatus: PpecStatus;
    idDpec: string;

}



export enum PpecStatus {
    EAA = 'En attente acceptation',
    ANN = 'Annulé',
    ACC = 'Accepté'
}