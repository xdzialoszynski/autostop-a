export interface Dpec {
    id: number;
    positionGps: string;
    horodatage: number;
    photo: string;
    pseudo: string;
    destination: string;
    identifiantSession: string;
    dpecStatus: DpecStatus;
}

export enum DpecStatus {
    EAA = 'En attente acceptation',
    ANN = 'Annulé',
    ACC = 'Accepté'
}