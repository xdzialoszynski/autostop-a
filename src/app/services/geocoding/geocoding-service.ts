import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly BASE_URL = 'https://nominatim.openstreetmap.org/search';

  constructor(private httpClient: HttpClient) { }

  getAutocompletion(query: string): Observable<any> {
    const params = new HttpParams()
      .set('city', query)
      .set('country', 'france')
      .set('format', 'json');

    return this.httpClient.get(this.BASE_URL, { params });
  }
}
