import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsCoordinates } from './gps-coordinates';

describe('GpsCoordinates', () => {
  let component: GpsCoordinates;
  let fixture: ComponentFixture<GpsCoordinates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GpsCoordinates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GpsCoordinates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
