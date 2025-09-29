import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpecsList } from './ppecs-list';

describe('PpecsList', () => {
  let component: PpecsList;
  let fixture: ComponentFixture<PpecsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PpecsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpecsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
