import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environements/environement';
import { Dpec } from '../../models/dpec-interface';

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

  postDpecRequest(data: Dpec): Observable<Dpec> {
    this.setLoading(true);

    return this.httpClient.post<Dpec>(environment.apiUrl, data).pipe(
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
    this.setLoading(true);

    return this.httpClient.delete(`${environment.apiUrl}/${id}`).pipe(
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
}
