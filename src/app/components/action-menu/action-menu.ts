import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Api } from '../../services/api/api';
import { AppStateService } from '../../services/app-state-service';
import { Dpec, DpecStatus } from '../../models/dpec-interface';

@Component({
  selector: 'app-action-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './action-menu.html',
  styleUrl: './action-menu.scss'
})
export class ActionMenu {

  constructor(private dpecService: Api, private state: AppStateService) { }

  //TODO: valider la technique de création de l'objet depuis le state, puis l'utilisation et l'exploitation du service 
  onAskRequest() {
    const data: Dpec = {
      id: 0, //sera fournit par le back
      positionGps: this.state.position!.lat + "," + this.state.position!.lng, //position obligatoire
      horodatage: Date.now(),
      photo: this.state.avatar!, //photo obligatoire
      destination: this.state.city?.name!,
      pseudo: this.state.pseudo!,//obligatoire
      dpecStatus: DpecStatus.EAA,
      identifiantSession: 'A déterminer'//TODO: à générer à l'ouverture de l'application, et stocker dans le storage local
    }

    this.dpecService.postDpecRequest(data);
  }

}
