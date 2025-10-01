import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AppStateService } from '../../services/app-state-service';
import { AutostopMap } from '../autostop-map/autostop-map';
import { PpecsList } from '../ppecs-list/ppecs-list';
import { StatusBarComponent } from '../status-bar/status-bar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [StatusBarComponent, AutostopMap, PpecsList, CommonModule]
})
export class Dashboard {
  constructor(private state: AppStateService) { }

  shouldShowPpecsList(): Observable<boolean> {
    return this.state.requestSent$;
  }

}
