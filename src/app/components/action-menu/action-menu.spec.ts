import { ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { Api } from '../../services/api/api';
import { AppStateService } from '../../services/app-state-service';
import { ActionMenu } from './action-menu';


//todo: mettre en place le test qui réalise l'utilisation de l'interface utilisateur pour vérifier le comportement du menu d'action

const apiServiceMock = {
  cancelDpecRequest: (dpecId: number) => { return of(true); },
  sendDpecRequest: (dpec: any) => { return null; },
  startPollingPpecRequest: (dpecId: number) => { return null; },
  postDpecRequest: () => of({
    id: 1,
    position: '48.8566,2.3522',
    horodatage: Date.now(),
    photo: 'data:image/png;base64,test-photo',
    pseudo: 'test-pseudo',
    destination: 'test-destination',
    identifiantSession: 'test-session-id',
    dpecStatus: 'EAA'
  })
};

describe('ActionMenu', () => {
  let component: ActionMenu;
  let fixture: ComponentFixture<ActionMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionMenu],
      providers: [AppStateService, { provide: Api, useValue: apiServiceMock }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActionMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Integration', () => {
  let component: ActionMenu;
  let fixture: ComponentFixture<ActionMenu>;
  let appStateService: AppStateService;

  const appStateServiceMock = {
    set avatar(value: string | null) { /* no-op */ },
    get avatar(): string | null { return null; },
    set pseudo(value: string | null) { /* no-op */ },
    get pseudo(): string | null { return null; },
    set city(value: any | null) { /* no-op */ },
    get city(): any | null { return null; },
    set position(value: any | null) { /* no-op */ },
    get position(): any | null { return null; },
    set requestSent(value: boolean) { /* no-op */ },
    get requestSent(): boolean { return false; }
  };



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionMenu],
      providers: [{
        provide: AppStateService
      }, {
        provide: Api, useValue: apiServiceMock
      }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ActionMenu);
    component = fixture.componentInstance;
    appStateService = TestBed.inject(AppStateService);

    fixture.detectChanges();
  });

  it('should be ready to send request', () => {
    appStateService.avatar = 'data:image/png;base64,test-avatar';
    appStateService.pseudo = 'test-pseudo';
    appStateService.city = { name: 'Marseille', display_name: 'Marseille, Bouches-du-Rhône, France', address: { postcode: '13000' }, position: { lat: 0, lng: 0 } };
    appStateService.position = { lat: 48.8566, lng: 2.3522 }; // Paris coordinates
    appStateService.requestSent = false;

    //ouverture du menu
    let menuTrigger = fixture.nativeElement.querySelector('button[matIconButton]');
    menuTrigger.click();
    fixture.detectChanges();

    //click sur sendRequest
    let askButton = document.querySelector('button[data-testid="ask-request"]') as HTMLButtonElement;
    let cancelButton = document.querySelector('button[data-testid="cancel-request"]') as HTMLButtonElement;
    expect(askButton.disabled).toBeFalse();
    expect(cancelButton.disabled).toBeTrue(); // should be disabled when no request is sent
    askButton.click();
    fixture.detectChanges();

    //ouverture du menu: le bouton askRequest doit être disabled et le bouton cancelRequest enabled
    menuTrigger = fixture.nativeElement.querySelector('button[matIconButton]');
    menuTrigger.click();
    fixture.detectChanges();
    askButton = document.querySelector('button[data-testid="ask-request"]') as HTMLButtonElement;
    cancelButton = document.querySelector('button[data-testid="cancel-request"]') as HTMLButtonElement;
    expect(askButton.disabled).toBeTrue();
    expect(cancelButton.disabled).toBeFalse(); // bouton annuler disponible

    //click sur cancelRequest
    cancelButton.click();
    fixture.detectChanges();

    //ouverture du menu: retour à l'état initial
    menuTrigger = fixture.nativeElement.querySelector('button[matIconButton]');
    menuTrigger.click();
    fixture.detectChanges();
    askButton = document.querySelector('button[data-testid="ask-request"]') as HTMLButtonElement;
    cancelButton = document.querySelector('button[data-testid="cancel-request"]') as HTMLButtonElement;
    expect(askButton.disabled).toBeFalse();
    expect(cancelButton.disabled).toBeTrue(); // bouton annuler disponible
  });
});
