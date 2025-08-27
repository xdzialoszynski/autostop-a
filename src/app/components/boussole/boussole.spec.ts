import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorSubject, of } from 'rxjs';
import { AppStateService } from '../../services/app-state-service';
import { Boussole } from './boussole';
import { GeocodingResult, Position } from '../../shared/interfaces/geocoding.interface';

class MockAppStateService {
  private positionSubject = new BehaviorSubject<Position | null>(null);
  private citySubject = new BehaviorSubject<GeocodingResult | null>(null);

  position$ = this.positionSubject.asObservable();
  city$ = this.citySubject.asObservable();

  emitPosition(pos: Position | null) {
    this.positionSubject.next(pos);
  }

  emitCity(city: GeocodingResult | null) {
    this.citySubject.next(city);
  }
}

describe('Boussole', () => {
  let component: Boussole;
  let fixture: ComponentFixture<Boussole>;
  let appStateService: AppStateService;
  let mock: MockAppStateService;

  const marseilleCity = {
    name: 'marseille', address: { postcode: '13000' }, position: { lat: 43.295, lng: 5.372 }, display_name: 'Marseille, 13000'
  };
  const parisCity = {
    name: 'paris', address: { postcode: '75000' }, position: { lat: 48.8566, lng: 2.3522 }, display_name: 'Paris, 75000'
  }


  beforeEach(async () => {
    mock = new MockAppStateService();

    await TestBed.configureTestingModule({
      imports: [Boussole],
      providers: [{ provide: AppStateService, useValue: mock }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Boussole);
    component = fixture.componentInstance;
    appStateService = TestBed.inject(AppStateService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('shouldComputeBearing', () => {
    mock.emitPosition(parisCity.position);
    mock.emitCity(marseilleCity);
    fixture.detectChanges();
    expect(component.bearing).toBeCloseTo(158.25, 1);
  });

  it('shouldUnsubsribedWhenDestroyed', () => {
    spyOn(component['destroy$'], 'next').and.callThrough();
    spyOn(component['destroy$'], 'complete').and.callThrough();
    fixture.detectChanges();
    fixture.destroy();
    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });

  it('shouldHaveDefaultValue', () => {
    fixture.detectChanges();
    expect(component.bearing).toBe(0);
  });

});
