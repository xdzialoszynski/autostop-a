import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, Subject, tap, throwError } from 'rxjs';
import { environment } from '../../../environements/environement';
import { Dpec } from '../../models/dpec-interface';
import { Ppec } from '../../models/ppec-interface';

@Injectable({
  providedIn: 'root'
})
export class Api {

  constructor(private httpClient: HttpClient) { }

  private _loading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get loading$() {
    return this._loading$.asObservable();
  }

  setLoading(value: boolean) {
    this._loading$.next(value);
  }

  //DPEC requests
  patchDpecRequest(id: number, data: Partial<Dpec>): Observable<Dpec> {
    return this.httpClient.patch<Dpec>(`${environment.apiUrl}/dpecs/${id}`, data).pipe(
      catchError((error) => {
        console.log(`error dans l'api : ${error}`);
        return throwError(() => {
          new Error(`Erreur lors de la mise à jour de la DPEC avec l'id ${id}`);
        })
      })
    );
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

  //PPEC requests
  patchPPecRequest(id: number, data: Partial<Ppec>): Observable<Ppec> {
    return this.httpClient.patch<Ppec>(`${environment.apiUrl}/ppecs/${id}`, data).pipe(
      catchError((error) => {
        console.log(`error dans l'api : ${error}`);
        return throwError(() => {
          new Error(`Erreur lors de la mise à jour de la PPEC avec l'id ${id}`);
        })
      })
    );
  }

  getPpecsByDpecId(IdDpec: number): Observable<Ppec[]> {
    return this.httpClient.get<Ppec[]>(`${environment.apiUrl}/ppecs/${IdDpec}`).pipe(
      catchError((error) => {
        console.log(`error dans l'api : ${error}`);
        return throwError(() => {
          new Error(`Erreur lors de la récupération des PPEC associées à la DPEC avec l'id ${IdDpec}`);
        })
      })
    );
  }

}
