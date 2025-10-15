import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpecsList } from './ppecs-list';
import { AppStateService } from '../../services/app-state-service';
import { Api } from '../../services/api/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Position } from '../../shared/interfaces/geocoding.interface';
import { HttpRequest, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal, Signal } from '@angular/core';
import { Ppec, PpecStatus } from '../../models/ppec-interface';
import { Dpec, DpecStatus } from '../../models/dpec-interface';

class MockAppStateService {
  private positionSubject = new BehaviorSubject<Position | null>(null);
  position$ = this.positionSubject.asObservable();
  private _selectedPpecId: number = 0;
  get selectedPpecId(): number {
    return this._selectedPpecId;
  }
  set selectedPpecId(value: number) {
    this._selectedPpecId = value;
  }
  ppecs = signal<Ppec[]>([
    { id: 1, positionGps: '48.8566,2.3522', horodatage: Date.now(), photo: 'base64string1', pseudo: 'User1', destination: 'Destination1', identifiantSession: 'session1', ppecStatus: PpecStatus.EAA, idDpec: 101 },
    { id: 2, positionGps: '34.0522,-118.2437', horodatage: Date.now(), photo: 'base64string2', pseudo: 'User2', destination: 'Destination2', identifiantSession: 'session2', ppecStatus: PpecStatus.EAA, idDpec: 102 },
    { id: 3, positionGps: '51.5074,-0.1278', horodatage: Date.now(), photo: 'base64string3', pseudo: 'User3', destination: 'Destination3', identifiantSession: 'session3', ppecStatus: PpecStatus.EAA, idDpec: 103 }
  ]);

  set position(pos: Position | null) {
    this.positionSubject.next(pos);
  }

  get position(): Position | null {
    return this.positionSubject.getValue();
  }

};

describe('PpecsList', () => {
  let component: PpecsList;
  let fixture: ComponentFixture<PpecsList>;
  let httpTesting: HttpTestingController;
  let state: AppStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PpecsList],
      providers: [
        provideHttpClient(), provideHttpClientTesting(), // on mock en plus des intercepteurs
        Api,
        { provide: AppStateService, useValue: new MockAppStateService() },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PpecsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTesting = TestBed.inject(HttpTestingController);
    state = TestBed.inject(AppStateService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate a ppec successfully', async () => {
    const spy = spyOn(component, 'validatatePpec').and.callThrough();;
    let el: HTMLElement = fixture.nativeElement;
    const item = el.querySelector('.trip-item') as HTMLElement;
    item.click();

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(101, 1); //idDpec, idPpec

    httpTesting.expectOne((req: HttpRequest<Dpec>) => {
      console.log("Méthode réelle:", req.method);
      return req.method === 'PATCH' && req.url.includes('/dpecs/101') && req.body?.dpecStatus === DpecStatus.ACC;
    }, 'PATCH /dpecs/101 avec statut ACC').flush({ id: 101, positionGps: '48.8566,2.3522', horodatage: Date.now(), dpecStatus: DpecStatus.ACC, idPpec: 1 });

    httpTesting.expectOne((req: HttpRequest<Ppec>) => {
      console.log("Méthode réelle:", req.method);
      return req.method === 'PATCH' && req.url.includes('/ppecs/1') && req.body?.ppecStatus === PpecStatus.ACC;
    }, 'PATCH /ppecs/1 avec statut ACC').flush({ id: 101, positionGps: '48.8566,2.3522', horodatage: Date.now(), dpecStatus: DpecStatus.ACC, idPpec: 1 });

    httpTesting.verify();

    expect(state.selectedPpecId).toBe(101);


  })
});
