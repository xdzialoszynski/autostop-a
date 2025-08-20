import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashboard } from './dashboard';
import { of } from 'rxjs';
import { GeocodingService } from '../../services/geocoding/geocoding-service';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  beforeEach(async () => {
    const geocodingServiceMock = {
      getAutocompletion: () => of([])
    };

    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [{ provide: GeocodingService, useValue: geocodingServiceMock }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
