import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBarComponent } from './status-bar';
import { GeocodingService } from '../../services/geocoding/geocoding-service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;

  beforeEach(async () => {
    const geocodingServiceMock = {
      getAutocompletion: () => of([])
    };

    await TestBed.configureTestingModule({
      imports: [StatusBarComponent],
      providers: [
        { provide: GeocodingService, useValue: geocodingServiceMock },
        provideHttpClient(),

      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
