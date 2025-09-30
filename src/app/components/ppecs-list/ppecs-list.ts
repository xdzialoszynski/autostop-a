import { Component, signal, Signal } from '@angular/core';
import { AppStateService } from '../../services/app-state-service';
import { Ppec } from '../../models/ppec-interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Position } from '../../shared/interfaces/geocoding.interface';
import { Observable } from 'rxjs';
import { DistancePipe } from '../../pipes/distance-pipe';

@Component({
  selector: 'app-ppecs-list',
  imports: [CommonModule, MatIconModule, DistancePipe],
  templateUrl: './ppecs-list.html',
  styleUrl: './ppecs-list.scss'
})
export class PpecsList {
  items: Signal<Ppec[]> = signal([]);
  position$: Observable<Position | null>;

  constructor(private state: AppStateService) {
    this.items = this.state.ppecs;
    this.position$ = this.state.position$;
  }
}
