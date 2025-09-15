import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environements/environement';
import { of } from 'rxjs';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[HTTP Interceptor] Requête sortante : ${req.method} ${req.url}`);

  if (environment.apiUrl) {
    if (req.url === environment.apiUrl && req.method === 'POST') {
      const mockResponse = new HttpResponse({
        status: 200,
        body: true
      });
      return of(mockResponse);
    }
  }
  return next(req);
};
