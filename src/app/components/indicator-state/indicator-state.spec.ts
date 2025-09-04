import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorState } from './indicator-state';

describe('IndicatorState', () => {
  let component: IndicatorState;
  let fixture: ComponentFixture<IndicatorState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicatorState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicatorState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
