import { Component } from '@angular/core';
import { StatusBarComponent } from '../status-bar/status-bar';
import { AutostopMap } from '../autostop-map/autostop-map';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  imports: [StatusBarComponent, AutostopMap]
})
export class Dashboard {

}
