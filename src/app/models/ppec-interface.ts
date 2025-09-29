export interface Ppec {

    positionGps: string;
    horodatage: number; // timestamp
    photoBase64: string; // La photo sera envoyée encodée en Base64
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