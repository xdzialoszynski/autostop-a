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
    },

    {
        method: 'GET',
        path: new RegExp('autostop/ppecs'),
        handler: (req: HttpRequest<any>) => {
            console.log('Mock GET request received to return all PPECs');
            return of(new HttpResponse({
                status: 200, body: [{
                    id: 1,
                    positionGps: '45.79642091527025, 3.09812019937941',
                    horodatage: Date.now(),
                    photo: 'base64EncodedPhotoString',
                    pseudo: 'MockUser',
                    destination: 'MockDestination',
                    identifiantSession: 'MockSessionId',
                    dpecStatus: DpecStatus.EAA
                },
                {
                    id: 2,
                    positionGps: '45.75426766798239, 4.8563532775513485',
                    horodatage: Date.now(),
                    photo: 'base64EncodedPhotoString',
                    pseudo: 'AnotherMockUser',
                    destination: 'AnotherMockDestination',
                    identifiantSession: 'AnotherMockSessionId',
                    dpecStatus: DpecStatus.ANN
                }]
            }));
        }
    }
]