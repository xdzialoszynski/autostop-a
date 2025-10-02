import { Injectable, OnDestroy } from '@angular/core';
import { catchError, distinctUntilChanged, filter, merge, Observable, of, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { Ppec } from '../../models/ppec-interface';
import { Api } from '../api/api';
import { AppStateService } from '../app-state-service';
import { IndicatorState } from '../app-state.enum';

@Injectable({
  providedIn: 'root'
})
export class RequestMonitorService implements OnDestroy {
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private api: Api, private state: AppStateService) { }


  startPollingPpecRequest(IdDpec: number): Observable<Ppec[] | null> {
    return this.state.indicator$.pipe(
      distinctUntilChanged(),//car l'indicator est calculé à partir de la position qui change souvent, impliquant l'emission de la même valeur pour l'indicator
      tap(() => console.trace('Démarrage du polling pour la DPEC ID:', IdDpec)),
      switchMap((indicator) => {
        if (indicator === IndicatorState.REQUEST_SENT) {
          return timer(0, 5000).pipe(
            switchMap(() => this.api.getPpecsByDpecId(IdDpec).pipe(
              catchError((error) => {
                console.log(`error dans l'api : ${error}`);
                return of(null);
              })
            )),
            takeUntil(merge(
              this.state.indicator$.pipe(filter(ind => ind !== IndicatorState.REQUEST_SENT)),
              this._destroy$
            ).pipe(tap(() => console.log('Arrêt du polling')))
            ))
        } else {
          return of(null);
        }
      }))
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    throw new Error('Method not implemented.');
  }


}
