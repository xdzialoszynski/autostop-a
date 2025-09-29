import { Component, signal, Signal } from '@angular/core';
import { AppStateService } from '../../services/app-state-service';
import { Ppec } from '../../models/ppec-interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ppecs-list',
  imports: [CommonModule, MatIconModule],
  templateUrl: './ppecs-list.html',
  styleUrl: './ppecs-list.scss'
})
export class PpecsList {
  items: Signal<Ppec[]> = signal([]);;

  constructor(private state: AppStateService) {
    this.items = this.state.ppecs;
  }
}
