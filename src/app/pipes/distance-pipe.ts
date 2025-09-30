import { Pipe, PipeTransform } from '@angular/core';
import { Position } from '../shared/interfaces/geocoding.interface';

@Pipe({
  name: 'distance',
  standalone: true
})
export class DistancePipe implements PipeTransform {

  /**
    * Calcule la distance à vol d'oiseau (formule Haversine) entre deux points GPS.
    * @param origin Le premier point (passé avant le pipe : | distance: ...).
    * @param destinationStr Le deuxième point sous forme de chaîne "lat,lng" (passé après le pipe).
    * @returns La distance en kilomètres (ou null si la destination est invalide).
    */
  transform(origin: Position | null, destinationStr: string): number | null {
    //todo: debuguer pourquoi je n'affiche rien avec les données de mocks
    if (!origin || !destinationStr) {
      return null;
    }

    // 1. Parser la chaîne de destination "lat,lng" en nombres
    const parts = destinationStr.split(',');
    if (parts.length !== 2) {
      console.error('Format de destination invalide. Attendu : "lat,lng"');
      return null;
    }

    const destLat = parseFloat(parts[0].trim());
    const destLng = parseFloat(parts[1].trim());

    if (isNaN(destLat) || isNaN(destLng)) {
      console.error('Les coordonnées de destination doivent être numériques.');
      return null;
    }

    const destination: Position = { lat: destLat, lng: destLng };

    // 2. Implémentation de la formule Haversine (pour la précision)
    const R = 6371; // Rayon de la Terre en kilomètres
    const dLat = this.deg2rad(destination.lat - origin.lat);
    const dLng = this.deg2rad(destination.lng - origin.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(origin.lat)) *
      Math.cos(this.deg2rad(destination.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Résultat en km, arrondi à 2 décimales
    return Math.round((R * c) * 100) / 100;
  }

  // Fonction utilitaire pour convertir les degrés en radians
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

}
