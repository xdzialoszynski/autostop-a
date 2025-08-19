import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { CitySelector } from './city-selector';

describe('CitySelector', () => {
  let component: CitySelector;
  let fixture: ComponentFixture<CitySelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySelector],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CitySelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
