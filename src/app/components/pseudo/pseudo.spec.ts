import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';

import { AppStateService } from '../../services/app-state-service';
import { Pseudo } from './pseudo';

describe('Pseudo', () => {
  let component: Pseudo;
  let fixture: ComponentFixture<Pseudo>;
  let appStateService: AppStateService;
  let pseudoSubject: BehaviorSubject<string | null>;
  let pseudoSetterSpy: jasmine.Spy;

  beforeEach(async () => {
    pseudoSubject = new BehaviorSubject<string | null>(null);

    // Créer un objet mock pour AppStateService.
    // Il doit avoir une propriété `pseudo$` et un setter pour `pseudo`.
    const appStateServiceMock = {
      pseudo$: pseudoSubject.asObservable(),
      // Le setter est nécessaire pour que le spy puisse s'y attacher.
      set pseudo(value: string | null) {
        /* no-op */
      },
      get pseudo(): string | null {
        return null;
      }
    };

    await TestBed.configureTestingModule({
      imports: [Pseudo],
      providers: [
        { provide: AppStateService, useValue: appStateServiceMock },
        provideNoopAnimations()
      ]
    });

    fixture = TestBed.createComponent(Pseudo);
    component = fixture.componentInstance;

    // On récupère l'instance injectée (notre mock) et on espionne son setter.
    appStateService = TestBed.inject(AppStateService);
    pseudoSetterSpy = spyOnProperty(appStateService, 'pseudo', 'set');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display mode', () => {
    it('should display "Définir un pseudo" when pseudo is null', () => {
      pseudoSubject.next(null);
      fixture.detectChanges();
      const displayElement: HTMLElement = fixture.nativeElement.querySelector('.pseudo-display span');
      expect(displayElement.textContent).toContain('Définir un pseudo');
    });

    it('should display the pseudo when it is set', () => {
      const testPseudo = 'TestUser';
      pseudoSubject.next(testPseudo);
      fixture.detectChanges();
      const displayElement: HTMLElement = fixture.nativeElement.querySelector('.pseudo-display span');
      expect(displayElement.textContent).toContain(testPseudo);
    });

    it('should switch to edit mode on click', fakeAsync(() => {
      const displayElement = fixture.debugElement.query(By.css('.pseudo-display'));
      displayElement.triggerEventHandler('click', null);
      fixture.detectChanges();
      tick();
      expect(component.isEditing).toBe(true);
      const editContainer = fixture.nativeElement.querySelector('.pseudo-edit');
      expect(editContainer).toBeTruthy();
    }));
  });

  describe('Edit mode', () => {
    beforeEach(fakeAsync(() => {
      component.switchToEditMode();
      fixture.detectChanges();
      tick(); // Exécute le setTimeout pour le focus
    }));

    it('should have save button disabled when input is invalid', () => {
      component.pseudoCtrl.setValue(''); // Invalide car `required`
      fixture.detectChanges();
      const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
      expect(saveButton.disabled).toBe(true);
    });

    it('should have save button enabled when input is valid', () => {
      component.pseudoCtrl.setValue('ValidPseudo');
      fixture.detectChanges();
      const saveButton: HTMLButtonElement = fixture.nativeElement.querySelector('button[color="primary"]');
      expect(saveButton.disabled).toBe(false);
    });

    it('should call appStateService.pseudo setter on save and switch back to display mode', () => {
      const newPseudo = 'NewPseudo';
      component.pseudoCtrl.setValue(newPseudo);
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(By.css('button[color="primary"]'));
      saveButton.triggerEventHandler('click', null);

      expect(pseudoSetterSpy).toHaveBeenCalledWith(newPseudo);
      expect(component.isEditing).toBe(false);
    });

    it('should switch back to display mode and reset value without saving on cancel click', fakeAsync(() => {
      const initialPseudo = 'InitialPseudo';
      pseudoSubject.next(initialPseudo);
      fixture.detectChanges();
      component.pseudoCtrl.setValue('Something new');
      fixture.detectChanges();

      const cancelButton = fixture.debugElement.query(By.css('button[color="warn"]'));
      cancelButton.triggerEventHandler('click', null);
      fixture.detectChanges(); // Appliquer le changement de isEditing (la vue est mise à jour)
      tick();                  // Exécuter le code asynchrone (setTimeout) dans cancelEdit

      expect(pseudoSetterSpy).not.toHaveBeenCalled();
      expect(component.isEditing).toBe(false);
      expect(component.pseudoCtrl.value).toBe(initialPseudo);
    }));

    it('should switch back to display mode and reset value on Escape key', fakeAsync(() => {
      const initialPseudo = 'InitialPseudo';
      pseudoSubject.next(initialPseudo);
      component.pseudoCtrl.setValue('Something new');
      fixture.detectChanges();

      const inputElement = fixture.debugElement.query(By.css('input'));
      inputElement.triggerEventHandler('keyup.escape', {});
      fixture.detectChanges();
      tick();

      expect(pseudoSetterSpy).not.toHaveBeenCalled();
      expect(component.isEditing).toBe(false);
      expect(component.pseudoCtrl.value).toBe(initialPseudo);
    }));
  });
});
