import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { environment } from '../../../../environements/environement';
import { of } from 'rxjs';
import { Dpec, DpecStatus } from '../../../models/dpec-interface';
import { mockApiRoutes } from '../../../../mocks/mock-api.routes';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  console.log(`[HTTP Interceptor] Requête sortante : ${req.method} ${req.url}`);

  if (environment.production === false) {
    const matchingRoute = mockApiRoutes.find(route => route.method === req.method && route.path.test(req.url));

    if (matchingRoute) {
      return matchingRoute.handler(req);
    }

  }

  return next(req);
};
