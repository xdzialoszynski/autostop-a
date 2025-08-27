import { Component, OnDestroy, OnInit } from '@angular/core';
import { Pseudo } from '../pseudo/pseudo';
import { Avatar } from "../avatar/avatar";
import { CitySelector } from '../city-selector/city-selector';
import { GpsCoordinates } from '../gps-coordinates/gps-coordinates';
import { Boussole } from '../boussole/boussole';

@Component({
  selector: 'app-status-bar',
  standalone: true,
  templateUrl: './status-bar.html',
  styleUrl: './status-bar.scss',
  imports: [Pseudo, Avatar, CitySelector, GpsCoordinates, Boussole]
})
export class StatusBarComponent {

}
