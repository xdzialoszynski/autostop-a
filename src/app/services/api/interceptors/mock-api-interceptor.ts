import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environements/environement';
import { of } from 'rxjs';
import { Dpec, DpecStatus } from '../../../models/dpec-interface';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[HTTP Interceptor] Requête sortante : ${req.method} ${req.url}`);

  // todo: simuler la réponse pour le cas de la suppression, avec refacto éventuelle de l'interceptor

  if (environment.apiUrl) {
    if (req.url === environment.apiUrl && req.method === 'POST') {
      const mockResponse = new HttpResponse<Dpec>({
        status: 200,
        body: {
          id: 1,
          positionGps: '48.8566,2.3522',
          horodatage: Date.now(),
          photo: 'base64EncodedPhotoString',
          pseudo: 'MockUser',
          destination: 'MockDestination',
          identifiantSession: 'MockSessionId',
          dpecStatus: DpecStatus.EAA
        }
      });
      return of(mockResponse);
    }
  }
  return next(req);
};
