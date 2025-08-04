import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pseudo } from './pseudo';

describe('Pseudo', () => {
  let component: Pseudo;
  let fixture: ComponentFixture<Pseudo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [Pseudo]
})
    .compileComponents();

    fixture = TestBed.createComponent(Pseudo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
