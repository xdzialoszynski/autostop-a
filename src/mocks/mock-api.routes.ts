import { HttpRequest, HttpResponse } from "@angular/common/http"
import { of } from "rxjs";
import { DpecStatus } from "../app/models/dpec-interface";


export const mockApiRoutes = [
    {
        method: 'DELETE',
        path: new RegExp('autostop/dpecs/\\d+'),
        handler: (req: HttpRequest<any>) => {
            const segments = req.url.split('/');
            const id = segments[segments.length - 1];
            console.log(`Mock DELETE request received for DPEC with id: ${id}`);
            return of(new HttpResponse({ status: 204 }));
        }
    },

    {
        method: 'POST',
        path: new RegExp('autostop/dpecs'),
        handler: (req: HttpRequest<any>) => {
            console.log('Mock POST request received to create a new DPEC');
            return of(new HttpResponse({
                status: 201, body: {
                    id: 1,
                    positionGps: '48.8566,2.3522',
                    horodatage: Date.now(),
                    photo: 'base64EncodedPhotoString',
                    pseudo: 'MockUser',
                    destination: 'MockDestination',
                    identifiantSession: 'MockSessionId',
                    dpecStatus: DpecStatus.EAA
                }
            }));
        }
    }
]