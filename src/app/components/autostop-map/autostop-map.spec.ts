import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutostopMap } from './autostop-map';

describe('AutostopMap', () => {
  let component: AutostopMap;
  let fixture: ComponentFixture<AutostopMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AutostopMap]
})
    .compileComponents();

    fixture = TestBed.createComponent(AutostopMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
