import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
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

  postDpecRequest(data: Dpec) {
    this.setLoading(true);

    return this.httpClient.post(environment.apiUrl, data).pipe(
      map(() => true),
      catchError((error, caught) => {
        console.log(error);
        return of(false);
      })
    )
  }
}
