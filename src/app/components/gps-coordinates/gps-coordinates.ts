import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from '../../services/app-state-service';
import { map, Observable, Subject, takeUntil, throttleTime } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-gps-coordinates',
  imports: [CommonModule, MatIconModule],
  templateUrl: './gps-coordinates.html',
  styleUrl: './gps-coordinates.scss'
})
export class GpsCoordinates implements OnInit, OnDestroy {
  displayPosition$!: Observable<string>;
  private destroy$ = new Subject<void>();

  constructor(private state: AppStateService) { }

  ngOnInit(): void {
    this.initUserLocation();
    this.displayPosition$ = this.state.position$.pipe(
      map(position => {
        if (!position) {
          return 'Localisation...';
        }
        const lat = Math.abs(position.lat).toFixed(4);
        const latDir = position.lat >= 0 ? 'N' : 'S';
        const lng = Math.abs(position.lng).toFixed(4);
        const lngDir = position.lng >= 0 ? 'E' : 'O';
        return `${lat}° ${latDir}, ${lng}° ${lngDir}`;
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initUserLocation() {
    if (navigator.geolocation) {
      const location$ = new Observable<GeolocationPosition>(observer => {
        const watchId = navigator.geolocation.watchPosition(
          (pos) => observer.next(pos),
          (err) => observer.error(err),
          { enableHighAccuracy: true }
        );

        // Lorsque le subscriber se désinscrit, on arrête le suivi
        return () => navigator.geolocation.clearWatch(watchId);
      });

      location$.pipe(
        // On ne met à jour la position que toutes les 5 secondes au maximum
        throttleTime(5000, undefined, { leading: true, trailing: true }),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (pos) => {
          this.state.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        },
        error: (err) => {
          console.error(`Erreur de géolocalisation (code ${err.code}): ${err.message}`);
        }
      });
    } else {
      console.warn("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  }
}
