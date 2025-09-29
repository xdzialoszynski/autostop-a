import { Component } from '@angular/core';
import { StatusBarComponent } from '../status-bar/status-bar';
import { AutostopMap } from '../autostop-map/autostop-map';
import { PpecsList } from '../ppecs-list/ppecs-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [StatusBarComponent, AutostopMap, PpecsList]
})
export class Dashboard {

}
