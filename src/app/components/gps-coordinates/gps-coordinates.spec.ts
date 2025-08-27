import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GpsCoordinates } from './gps-coordinates';
import { AppStateService } from '../../services/app-state-service';
import { BehaviorSubject, first } from 'rxjs';
import { Position } from '../../shared/interfaces/geocoding.interface';

// Mock AppStateService
class MockAppStateService {
  private positionSubject = new BehaviorSubject<Position | null>(null);
  position$ = this.positionSubject.asObservable();

  set position(pos: Position | null) {
    this.positionSubject.next(pos);
  }

  get position(): Position | null {
    return this.positionSubject.getValue();
  }
}

describe('GpsCoordinates', () => {
  let component: GpsCoordinates;
  let fixture: ComponentFixture<GpsCoordinates>;
  let appStateService: AppStateService;
  let watchPositionSpy: jasmine.Spy;
  let clearWatchSpy: jasmine.Spy;
  let successCallback: (pos: GeolocationPosition) => void;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsCoordinates],
      providers: [
        { provide: AppStateService, useClass: MockAppStateService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GpsCoordinates);
    component = fixture.componentInstance;
    appStateService = TestBed.inject(AppStateService);

    // Mock geolocation
    watchPositionSpy = spyOn(navigator.geolocation, 'watchPosition').and.callFake((success) => {
      successCallback = success; // On capture le callback pour le déclencher manuellement
      return 123;
    });
    clearWatchSpy = spyOn(navigator.geolocation, 'clearWatch');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initUserLocation', () => {
      spyOn(component, 'initUserLocation');
      fixture.detectChanges(); // triggers ngOnInit
      expect(component.initUserLocation).toHaveBeenCalled();
    });

    it('should initialize displayPosition$ with correct format', (done) => {
      fixture.detectChanges(); // ngOnInit

      // Test avec une position positive
      appStateService.position = { lat: 10, lng: 20 };
      component.displayPosition$.pipe(first()).subscribe(display => {
        expect(display).toBe('10.0000° N, 20.0000° E');

        // Test avec une position négative
        appStateService.position = { lat: -45.5, lng: -75.25 };
        component.displayPosition$.pipe(first()).subscribe(display2 => {
          expect(display2).toBe('45.5000° S, 75.2500° O');
          done();
        });
      });
    });
  });

  describe('initUserLocation and throttling', () => {
    const mockPosition1: GeolocationPosition = {
      coords: { latitude: 48.85, longitude: 2.35, accuracy: 1, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
      timestamp: Date.now(),
    } as GeolocationPosition;
    ;
    const mockPosition2: GeolocationPosition = {
      coords: { latitude: 48.86, longitude: 2.36, accuracy: 1, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
      timestamp: Date.now(),
    } as GeolocationPosition;;
    const mockPosition3: GeolocationPosition = {
      coords: { latitude: 48.87, longitude: 2.37, accuracy: 1, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
      timestamp: Date.now(),
    } as GeolocationPosition;;

    it('should call navigator.geolocation.watchPosition on init', () => {
      fixture.detectChanges(); // ngOnInit calls initUserLocation
      expect(watchPositionSpy).toHaveBeenCalled();
    });

    it('should update state immediately for the first position (leading: true)', fakeAsync(() => {
      const positionSetterSpy = spyOnProperty(appStateService, 'position', 'set').and.callThrough();
      fixture.detectChanges(); // ngOnInit

      successCallback(mockPosition1);
      tick(); // process the emission

      expect(positionSetterSpy).toHaveBeenCalledWith({ lat: 48.85, lng: 2.35 });
      expect(positionSetterSpy.calls.count()).toBe(1);
    }));

    it('should throttle subsequent position updates', fakeAsync(() => {
      const positionSetterSpy = spyOnProperty(appStateService, 'position', 'set').and.callThrough();
      fixture.detectChanges();

      // 1. Première position (leading: true)
      successCallback(mockPosition1);
      tick();
      expect(positionSetterSpy.calls.count()).toBe(1);
      expect(appStateService.position).toEqual({ lat: 48.85, lng: 2.35 });

      // 2. Positions suivantes pendant la période de throttle
      tick(1000);
      successCallback(mockPosition2); // Devrait être mise en buffer
      tick(1000);
      successCallback(mockPosition3); // Devrait remplacer la valeur en buffer
      expect(positionSetterSpy.calls.count()).toBe(1); // Pas de nouvelle mise à jour

      // 3. Fin de la période de throttle, la dernière valeur est émise (trailing: true)
      tick(3000); // 5000ms au total se sont écoulées
      expect(positionSetterSpy.calls.count()).toBe(2);
      expect(appStateService.position).toEqual({ lat: 48.87, lng: 2.37 });
    }));
  });

  describe('ngOnDestroy', () => {
    it('should call navigator.geolocation.clearWatch', () => {
      fixture.detectChanges(); // pour démarrer le watch
      fixture.destroy(); // triggers ngOnDestroy
      expect(clearWatchSpy).toHaveBeenCalledWith(123);
    });
  });
});
