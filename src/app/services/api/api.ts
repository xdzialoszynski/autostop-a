import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, filter, interval, map, merge, Observable, of, Subject, switchMap, takeUntil, tap, throwError, timer } from 'rxjs';
import { environment } from '../../../environements/environement';
import { Dpec } from '../../models/dpec-interface';
import { Ppec } from '../../models/ppec-interface';
import { AppStateService } from '../app-state-service';
import { IndicatorState } from '../app-state.enum';

@Injectable({
  providedIn: 'root'
})
export class Api implements OnDestroy {

  constructor(private httpClient: HttpClient, private state: AppStateService) { }

  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _destroy$: Subject<void> = new Subject<void>();

  get loading$() {
    return this._loading$.asObservable();
  }

  setLoading(value: boolean) {
    this._loading$.next(value);
  }

  postDpecRequest(data: Dpec): Observable<Dpec> {
    const path = '/dpecs'
    this.setLoading(true);

    return this.httpClient.post<Dpec>(`${environment.apiUrl}${path}`, data).pipe(
      tap(() => this.setLoading(false)),
      catchError((error, caught) => {
        console.log(`error dans l'api : ${error}`);
        return throwError(() => {
          new Error("Erreur lors de l'envoi de la requête DPEC");
        })
      })
    );
  }

  cancelDpecRequest(id: number): Observable<boolean> {
    const path = `/dpecs/${id}`;
    this.setLoading(true);

    return this.httpClient.delete(`${environment.apiUrl}${path}`).pipe(
      map(() => true),
      tap(() => this.setLoading(false)),
      catchError((error, caught) => {
        console.log(`error dans l'api : ${error}`);
        return throwError(() => {
          new Error(`Erreur lors de l'annulation de la requête DPEC avec l'id ${id}`);
        })
      })
    )
  }

  startPollingPpecRequest(IdDpec: number): Observable<Ppec[] | null> {
    return this.state.indicator$.pipe(
      distinctUntilChanged(),//car l'indicator est calculé à partir de la position qui change souvent, impliquant l'emission de la même valeur pour l'indicator
      tap(() => console.trace('Démarrage du polling pour la DPEC ID:', IdDpec)),
      switchMap((indicator) => {
        if (indicator === IndicatorState.REQUEST_SENT) {
          return timer(0, 5000).pipe(
            switchMap(() => this.httpClient.get<Ppec[]>(`${environment.apiUrl}/ppecs/${IdDpec}`).pipe(
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
  }
}
