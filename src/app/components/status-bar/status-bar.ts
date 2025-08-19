import { Component } from '@angular/core';
import { Pseudo } from '../pseudo/pseudo';
import { Avatar } from "../avatar/avatar";
import { CitySelector } from '../city-selector/city-selector';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  templateUrl: './status-bar.html',
  styleUrl: './status-bar.scss',
  imports: [Pseudo, Avatar, CitySelector]
})
export class StatusBarComponent {

}
