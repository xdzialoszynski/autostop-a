import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GeocodingResult } from '../../shared/interfaces/geocoding.interface';
import { NominatimResult } from '../../shared/interfaces/nominatim.interface';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {
  private readonly BASE_URL = 'https://nominatim.openstreetmap.org/search';

  constructor(private httpClient: HttpClient) { }

  getAutocompletion(query: string): Observable<GeocodingResult[]> {
    const params = new HttpParams()
      .set('city', query)
      .set('country', 'france')
      .set('addressdetails', '1')
      .set('format', 'json');

    return this.httpClient.get<NominatimResult[]>(this.BASE_URL, { params }).pipe(
      map(results => {
        return results.map((result: NominatimResult): GeocodingResult => (
          {
            address: {
              postcode: result.address?.postcode
            },
            display_name: result.display_name,
            name: result.name,
            position: {
              lat: parseFloat(result.lat),
              lng: parseFloat(result.lon)
            }
          })
        )
      })
    );
  }
}
