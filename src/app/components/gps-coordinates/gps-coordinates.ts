import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppStateService } from '../../services/app-state-service';
import { map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

const ICON = `
 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
`;

const ICON2 = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z"/></svg>`;

@Component({
  selector: 'app-gps-coordinates',
  imports: [CommonModule, MatIconModule],
  templateUrl: './gps-coordinates.html',
  styleUrl: './gps-coordinates.scss'
})
export class GpsCoordinates implements OnInit, OnDestroy {
  id!: number;
  displayPosition$!: Observable<string>;

  constructor(private state: AppStateService) { }

  ngOnInit(): void {
    this.initUserLocation();
    this.displayPosition$ = this.state.position$.pipe(
      map(position => `${position?.lat}° N, ${position?.lng}° E`)
    )
  }

  ngOnDestroy(): void {
    navigator.geolocation.clearWatch(this.id);
  }

  initUserLocation() {
    if (navigator.geolocation) {
      this.id = navigator.geolocation.watchPosition((pos) => {
        console.log(this.id);
        console.log(pos);
        this.state.position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      })
    }

  }

}
