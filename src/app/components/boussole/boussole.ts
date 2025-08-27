import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppStateService } from '../../services/app-state-service';
import { Subject, takeUntil, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-boussole',
  imports: [CommonModule],
  templateUrl: './boussole.html',
  styleUrl: './boussole.scss'
})
export class Boussole implements OnInit {
  constructor(private state: AppStateService) { }

  // Taille de la boussole SVG
  svgSize = 40; // px
  center = this.svgSize / 2;
  needleLength = this.center * 0.8;
  bearing: number = 0;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    combineLatest([this.state.position$, this.state.city$]).pipe(
      takeUntil(this.destroy$),
      map(([position, city]) =>
        calculateBearing(position?.lat || 0, position?.lng || 0, city?.position?.lat || 0, city?.position?.lng || 0)
      )
    ).subscribe(bearing => {
      this.bearing = bearing;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}


const calculateBearing = (startLat: number, startLng: number, destLat: number, destLng: number): number => {
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;

  const lat1 = toRadians(startLat);
  const lon1 = toRadians(startLng);
  const lat2 = toRadians(destLat);
  const lon2 = toRadians(destLng);

  const deltaLon = lon2 - lon1;

  const y = Math.sin(deltaLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);

  let bearing = Math.atan2(y, x);
  bearing = toDegrees(bearing);
  return (bearing + 360) % 360; // Normalize to 0-360
};
