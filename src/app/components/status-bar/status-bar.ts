import { Component } from '@angular/core';
import { Pseudo } from '../pseudo/pseudo';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  templateUrl: './status-bar.html',
  styleUrl: './status-bar.scss',
  imports: [Pseudo]
})
export class StatusBarComponent {

}
