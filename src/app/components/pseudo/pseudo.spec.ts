import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Pseudo } from './pseudo';
import { AppStateService } from '../../services/app-state-service';

describe('Pseudo', () => {
  let component: Pseudo;
  let fixture: ComponentFixture<Pseudo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pseudo, NoopAnimationsModule],
      // Les services injectés dans le composant doivent être fournis dans le test
      providers: [AppStateService]
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
