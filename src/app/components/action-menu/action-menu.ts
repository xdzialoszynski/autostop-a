import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Dpec, DpecStatus } from '../../models/dpec-interface';
import { Api } from '../../services/api/api';
import { AppStateService } from '../../services/app-state-service';
import { IndicatorState } from '../../services/app-state.enum';
import { RequestMonitorService } from '../../services/monitoring/request-monitor-service';

@Component({
  selector: 'app-action-menu',
  imports: [MatButtonModule, MatMenuModule, MatIconModule, CommonModule],
  templateUrl: './action-menu.html',
  styleUrl: './action-menu.scss'
})
export class ActionMenu {

  public IndicatorState = IndicatorState; // rendre l'enum accessible dans le template

  constructor(private dpecService: Api, public state: AppStateService, private monitor: RequestMonitorService) { }


  onCancelRequest() {
    //todo: il faudra gérer le cas où une ppec a été acceptée, et donc modifier son statut.

    console.log(`onCancelRequest : dpecId = ${this.state.dpecId}`);
    if (this.state.dpecId) {
      this.dpecService.cancelDpecRequest(this.state.dpecId).subscribe(
        (result) => {
          if (result) {
            // mettre à jour le state pour indiquer que la demande a été annulée
            this.state.requestSent = false;
            this.state.dpecId = null; // réinitialiser l'id de la DPEC

            console.log('DPEC request cancelled successfully');
          } else {
            console.error('Failed to cancel DPEC request.');
          }
        },

        (error) => {
          console.error('Error cancelling DPEC request:', error);
        })
    }
  }


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

    this.dpecService.postDpecRequest(data).subscribe(
      (result) => {
        if (result) {
          // mettre à jour le state pour indiquer que la demande a été envoyée
          this.state.requestSent = true;
          this.state.dpecId = result.id; // stocker l'id de la DPEC retournée par le back

          console.log('DPEC request sent successfully:', result);
          this.monitor.startPollingPpecRequest(result.id).subscribe(
            (value) => {
              this.state.ppecs = value ?? [];
            }
          ); //le polling s'arrêtera tout seul grâce au takeUntil

        } else {
          this.state.requestSent = false;
          this.state.dpecId = null;
          console.error('Failed to send DPEC request.');
        }
      },

      (error) => {
        console.error('Error sending DPEC request:', error);
      }
    );
  }
}
