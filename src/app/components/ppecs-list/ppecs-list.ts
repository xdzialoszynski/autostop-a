import { Component, signal, Signal } from '@angular/core';
import { AppStateService } from '../../services/app-state-service';
import { Ppec, PpecStatus } from '../../models/ppec-interface';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Position } from '../../shared/interfaces/geocoding.interface';
import { catchError, forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { DistancePipe } from '../../pipes/distance-pipe';
import { Api } from '../../services/api/api';
import { DpecStatus } from '../../models/dpec-interface';
import { RequestMonitorService } from '../../services/monitoring/request-monitor-service';

@Component({
  selector: 'app-ppecs-list',
  imports: [CommonModule, MatIconModule, DistancePipe],
  templateUrl: './ppecs-list.html',
  styleUrl: './ppecs-list.scss'
})
export class PpecsList {
  items: Signal<Ppec[]> = signal([]);
  position$: Observable<Position | null>;

  constructor(private state: AppStateService, private api: Api, private monitor: RequestMonitorService) {
    this.items = this.state.ppecs;
    this.position$ = this.state.position$;
  }

  selectPpec(ppec: Ppec) {

    //todo: 
    // 1. appeler l'api et mettre à jour dpec, ppec associées, en cas d'erreur il faudra gérer
    // 2. mettre à jour indicator, via une de ses variables, et faire clignoter l'icone de l'indicator
    // 3. déclencher le polling sur la ppec sélectionnée, qui alimentera selectedPpec (observable)
    // 4. modifier le template ppecs-list pour afficher un sablier, et la distance restante en couleur, en fonction de la présence d'une selectedPpec
    // 5. Prevoir une annulation de la ppec, sans que cela supprime la dpec, en recliquant dessus par exeemple
    //    La conséquence est que la dpec redevient visible pour les autres conducteurs
    //    La ppec selectionnée change de statut pour indiquer qu'elle a été annulée par le passager
    // 
    let validateSubscription = this.validatatePpec(ppec.idDpec, ppec.id).subscribe(
      (result) => {
        if (result) {
          // alors tout est ok, on lance le polling
          this.monitor.startPollingOnePpec(ppec.id).subscribe();
        }
      },
      (error) => {
        console.error('Erreur lors de la validation de la PPEC :', error);
        validateSubscription.unsubscribe();
      }
    );

  }


  validatatePpec(idDpec: number, id: number): Observable<boolean> {
    //appel en parallèle des deux patchs sur dpec et ppec refletant la validation par le passager
    // gestion de l'annulation en cas de problème sur l'un des deux appels
    const validDpec$ = this.wrapperApiCall(this.api.patchDpecRequest(idDpec, { dpecStatus: DpecStatus.ACC }), 'DPEC');
    const validPpec$ = this.wrapperApiCall(this.api.patchPPecRequest(id, { ppecStatus: PpecStatus.ACC }), 'PPEC');
    const cancelDpec$ = this.api.patchDpecRequest(idDpec, { dpecStatus: DpecStatus.EAA });
    const cancelPpec$ = this.api.patchPPecRequest(id, { ppecStatus: PpecStatus.ANN });

    return forkJoin([validDpec$, validPpec$]).pipe(
      catchError(error => {
        // 💡 Si le débogueur s'arrête ICI, votre wrapperApiCall laisse passer l'erreur.
        console.error('Erreur du ForkJoin', error);
        return of([]); // Retourne un tableau vide pour permettre au switchMap de s'exécuter
      }),
      switchMap(result => {
        const dpecResult = result.find(r => r.type === 'DPEC');
        const ppecResult = result.find(r => r.type === 'PPEC');
        console.log('lancement des requetes de validation DPEC et PPEC', dpecResult, ppecResult);
        if (!dpecResult || !ppecResult) {
          // Si l'un des résultats est undefined, cela signifie un échec critique ou un formatage incorrect.
          console.error("Résultat du forkJoin non trouvé ou mal formaté.");
          return of(false); // 👈 Retourne un Observable ici pour éviter la fuite
        }

        if (dpecResult?.state && ppecResult?.state) {
          //tout est ok
          this.state.selectedPpecId = idDpec;
          return of(true);
        } else if (dpecResult?.state === false && ppecResult?.state === true) {
          //dpec ko, ppec ok, il faut annuler la ppec
          return cancelPpec$.pipe(
            map(val => true),
            catchError(err => {
              console.error('Echec de l\'annulation de la PPEC après échec de la DPEC', err);
              throw err;
            })
          )
        } else if (dpecResult?.state === true && ppecResult?.state === false) {
          //dpec ok, ppec ko, il faut annuler la dpec
          return cancelDpec$.pipe(
            map(val => true),
            catchError(err => {
              console.error('Echec de l\'annulation de la DPEC après échec de la PPEC', err);
              throw err;
            })
          )
        }
        else {
          return of(false);
        }
      })
    )
  }

  private wrapperApiCall(endpoint: Observable<any>, type: 'DPEC' | 'PPEC') {
    return endpoint.pipe(
      map(response => ({ type, state: true, response })),
      catchError((err) => {
        return of({ type: type, state: false, error: err })
      })
    )
  }


}
